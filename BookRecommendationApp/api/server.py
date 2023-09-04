from flask import Flask, jsonify
from flask_cors import CORS
from flask_restful import Api, Resource
import pandas as pd
import numpy as np
import sqlite3

print("Running...")

cs_loaded = np.load('./models/cosine_similarity_matrix_2_compressed.npz')['arr_0']
df = pd.read_csv('./databases/Goodreads_book_dataset_final.csv', encoding='utf-8')

app = Flask(__name__)
api = Api(app)
CORS(app)


class UserInfo(Resource):
    def get(self, username, password):
        conn = sqlite3.connect("./databases/Users.db")
        cursor = conn.cursor()
        cursor.execute("SELECT username, password FROM users WHERE username=? and password=?", (username, password))
        results = cursor.fetchall()

        if len(results) > 0:
            return True
        else:
            return False
class AddUser(Resource):
    def post(self, username, password):
        conn = sqlite3.connect("./databases/Users.db")
        c = conn.cursor()
        c.execute("SELECT EXISTS (SELECT * FROM users WHERE username = ?) AS user_exists;", (username,))
        result = c.fetchone()
        if result[0]:
            return jsonify({'message': 'User exists'})
        else:
            c.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, password))
            conn.commit()
            conn.close()
            return jsonify({'message': 'User created successfully'})


class BookInfo(Resource):
    def get(self, Title):
        conn = sqlite3.connect("./databases/goodreads_database_final.db")
        cursor = conn.cursor()
        cursor.execute("SELECT author, description, publisher, coverImg, rating FROM books where title=?", (Title,))
        results = cursor.fetchall()
        book_details = []
        if results is not None:
            book_details.append({
                'author': results[0][0],
                'description': results[0][1],
                'publisher': results[0][2],
                'coverImg': results[0][3],
                'rating': results[0][4],
            })
            return jsonify({'book_details': book_details})
        else:
            return None


class UserRating(Resource):
    def post(self, user, book, rating):
        conn = sqlite3.connect("./databases/Users.db")
        c = conn.cursor()
        c.execute('SELECT rating from ratings where username=? and book_title=?', (user, book))
        result = c.fetchall()

        if result:
            if result[0][0] != rating:
                if int(rating) >= 5:
                    rating = 5
                c.execute("UPDATE ratings SET rating=? where username=? and book_title=?", (rating, user, book))
                conn.commit()
                return jsonify({'message': 'Rating updated', 'book': book, 'new_rating': rating})

            elif result[0][0] == rating:
                return jsonify({'message': False})

        else:
            if int(rating) >= 5:
                rating = 5
            c.execute("INSERT INTO ratings (username, book_title, rating) VALUES (?, ?, ?)", (user, book, rating))
            conn.commit()
            return jsonify({'message': 'Rating Inserted!', 'book': book, 'rating': rating})

class CheckUserRating(Resource):
    def get(self, user, book):
        conn = sqlite3.connect("./databases/Users.db")
        c = conn.cursor()
        c.execute('SELECT rating from ratings where username=? and book_title=?', (user, book))
        result = c.fetchall()

        if result:
            return jsonify({'rating': result[0][0]})
        else:
            return jsonify({'rating': False})

class BookLikes(Resource):
    def post(self, user, book, liked):

        if int(liked) not in (1, 0):
            return jsonify({'message': False})
        else:
            conn = sqlite3.connect("./databases/Users.db")
            c = conn.cursor()
            c.execute('SELECT liked from favorites where username=? and book_title=?', (user, book))
            result = c.fetchall()

            if result:
                if result[0][0] is not None:
                    c.execute("UPDATE favorites SET liked=? where username=? and book_title=?", (liked, user, book))
                    conn.commit()
                    return jsonify({'message': 'Successfully updated!', 'book': book, 'liked': liked})

                elif result[0][0] == liked:
                    return jsonify({'message': False})

            else:
                c.execute("INSERT INTO favorites (username, book_title, liked) VALUES (?, ?, ?)", (user, book, liked))
                conn.commit()
                return jsonify({'message': 'Successfully added to favorites!', 'book': book, 'liked': liked})


class CheckUserLikes(Resource):
    def get(self, user, book):
        conn = sqlite3.connect("./databases/Users.db")
        c = conn.cursor()
        c.execute('SELECT liked from favorites where username=? and book_title=?', (user, book))
        result = c.fetchall()

        if result:
            return jsonify({'liked': result[0][0]})
        else:
            return jsonify({'liked': False})

class CheckUserFavorites(Resource):
    def get(self, user):
        conn = sqlite3.connect("./databases/Users.db")
        c = conn.cursor()
        c.execute('SELECT book_title FROM favorites where username=? and liked=1', (user,))
        result = c.fetchall()

        if result:
            return jsonify({'books': result})
        else:
            return jsonify({'books': False})


class BookRecommendation(Resource):
    def get(self, Genres=None, Title=None, limit=None):

        if Genres is not None:
            book_id = df[df.genres == Genres]['book_id'].values[0]
            scores = list(enumerate(cs_loaded[book_id]))

            sorted_scores = sorted(scores, key= lambda x:x[1], reverse= True)
            sorted_scores = sorted_scores[1:]

            j = 0
            recommended_books = []
            for item in sorted_scores:
                book_title = df[df.book_id == item[0]]['title'].values[0]
                cover_img = df[df.book_id == item[0]]['coverImg'].values[0]
                recommended_books.append({
                    'title': book_title,
                    'coverImg': cover_img
                })
                j = j + 1
                if j >= limit:
                    break

            return jsonify({'recommended_books': recommended_books})

        else:
            book_id_2 = df[df.title == Title]['book_id'].values[0]
            scores_2 = list(enumerate(cs_loaded[book_id_2]))

            sorted_scores_2 = sorted(scores_2, key= lambda x:x[1], reverse= True)
            sorted_scores_2 = sorted_scores_2[1:]

            k = 0
            recommended_books_title = []
            for item in sorted_scores_2:
                book_title = df[df.book_id == item[0]]['title'].values[0]
                cover_img = df[df.book_id == item[0]]['coverImg'].values[0]
                recommended_books_title.append({
                    'title': book_title,
                    'coverImg': cover_img
                })
                k = k + 1
                if k >= limit:
                    break

            return jsonify({'recommended_books_title': recommended_books_title})

api.add_resource(UserInfo, '/users/<username> <password>/', methods=['GET'])
api.add_resource(AddUser, '/addUser/<username> <password>/', methods=['POST'])
api.add_resource(BookInfo, '/more/<Title>')
api.add_resource(BookRecommendation, '/genre/<Genres>/<int:limit>', '/title/<Title>/<int:limit>')
api.add_resource(UserRating, '/userRating/<user>/<book>/<int:rating>/', methods=['POST'])
api.add_resource(CheckUserRating, '/checkUserRating/<user>/<book>/')
api.add_resource(BookLikes, '/bookLikes/<user>/<book>/<int:liked>/', methods=['POST'])
api.add_resource(CheckUserLikes, '/checkUserLikes/<user>/<book>/')
api.add_resource(CheckUserFavorites, '/checkUserFavorites/<user>/')

if __name__ == '__main__':
    app.run(debug=False, host="0.0.0.0", port=int("5000"))
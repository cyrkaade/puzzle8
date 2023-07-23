from pymongo import MongoClient
from dotenv import load_dotenv
import os
import certifi

# Load environment variables
load_dotenv()



# Fetch MongoDB details from the environment variables
MONGODB_URL = os.getenv('MONGODB_URL')

# Establish a connection to the database
client = MongoClient(MONGODB_URL, tlsCAFile=certifi.where())

# Create a reference to the database
database = client['puzzle']

# Create a reference to the collection
favorites_collection = database['favorites']

users_collection = database['User']
# CafeCosts
This app is a powerful tool for anyone involved in the baking or cafe industry. It allows users to calculate the cost of ingredients for cakes and other cafe products, ensuring that they can accurately price their items and maintain profitability. The app is easy to use and customizable, with features that allow users to adjust ingredient costs and quantities based on their specific needs. With its intuitive interface and robust functionality, this app is an essential asset for any baker or cafe owner looking to streamline their operations and maximize their profits.

# How to compile
### Step 1
```
mv .env-sample .env
```
Create a random string and place it in `SECRET_KEY `.
### Step 2
```
export FLASK_APP='models.py'
flask db init && flask db migrate && flask db upgrade
flask run
```

# Screenshots

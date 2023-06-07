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
![image](https://github.com/mohamadkhalaj/CafeCosts/assets/62938359/d7aed1cc-fe4d-43f9-8016-913eaddccad7)
![image](https://github.com/mohamadkhalaj/CafeCosts/assets/62938359/20f9abc7-2ab1-41cc-abf4-a022cfc64d55)
![image](https://github.com/mohamadkhalaj/CafeCosts/assets/62938359/14ab1cc9-7dbf-476a-bc53-dc83b34eb791)
![image](https://github.com/mohamadkhalaj/CafeCosts/assets/62938359/a8730416-e9be-41c4-a02a-299996fffbdf)
![image](https://github.com/mohamadkhalaj/CafeCosts/assets/62938359/20d36fb3-dc7f-42a2-b2ae-9ead60635879)
![image](https://github.com/mohamadkhalaj/CafeCosts/assets/62938359/5dd914c1-964c-4aa0-a82d-00ef72f9f933)
![image](https://github.com/mohamadkhalaj/CafeCosts/assets/62938359/f7d20e57-de96-4e58-a71c-3cb2f2e1014c)

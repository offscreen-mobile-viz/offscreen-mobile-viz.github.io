import pandas
import random

data = pandas.read_csv("_diamonds.csv")

newData = []
for _, row in data.iterrows():
    newData.append({
        'price': row.get('price'),
        'carat': row.get('carat'),
    })

# Shuffle the data
random.shuffle(newData)

# Save the new data to a new file
pandas.DataFrame(newData).to_csv('diamonds.csv')

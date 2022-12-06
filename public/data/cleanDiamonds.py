import pandas

data = pandas.read_csv("_diamonds.csv")

newData = []
for _, row in data.iterrows():
    newData.append({
        'price': row.get('price'),
        'carat': row.get('carat'),
    })

pandas.DataFrame(newData).to_csv('diamonds.csv')
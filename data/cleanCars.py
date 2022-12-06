import pandas

data = pandas.read_csv("_cars.csv")

newData = []
for _, row in data.iterrows():
    newData.append({
        'mpg-city': row.get('Fuel Information.City mpg'),
        'mpg-highway': row.get('Fuel Information.Highway mpg'),
        'horsepower': row.get('Engine Information.Engine Statistics.Horsepower'),
        'torque': row.get('Engine Information.Engine Statistics.Torque'),
    })

pandas.DataFrame(newData).to_csv('cars.csv')
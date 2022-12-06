import pandas

data = pandas.read_csv("_weather.csv")

newData = []
for _, row in data.iterrows():
    newData.append({
        'avg-temp': row.get('Data.Temperature.Avg-Temp'),
        'max-temp': row.get('Data.Temperature.Max-Temp'),
        'min-temp': row.get('Data.Temperature.Min-Temp'),
        'wind-speed': row.get('Data.Wind.Speed'),
    })

pandas.DataFrame(newData).to_csv('weather.csv')
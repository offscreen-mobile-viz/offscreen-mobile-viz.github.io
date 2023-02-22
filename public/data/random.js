// generates a random dataset for training in the user study
import { randomNormal } from 'd3-random';
import fs from 'fs';

const randomRow = () => {
    let x = randomNormal(50, 10)();
    let y = randomNormal(100, 25)();

    x = Math.round(x);
    y = Math.round(y);

    return { x, y };
};

const randomData = (n) => {
    let data = [];
    for (let i = 0; i < n; i++) {
        data.push(randomRow());
    }
    return data;
}

// write data to file with index
const writeData = (data) => {
    const path = './public/data/random.csv';

    // write data to file line by line
    fs.open(path, 'w', (err, fd) => {
        if (err) {
            console.log(err);
        } else {
            // write header
            fs.write(fd, 'index,x,y\n', (err) => {
                if (err) {
                    console.log(err);
                }
            });
            data.forEach((d, i) => {
                fs.write(fd, `${i},${d.x},${d.y}\n`, (err) => {
                    if (err) {
                        console.log(err);
                    }
                })
            });
        }
    });
}

const data = randomData(5000);
writeData(data);
import * as d3 from 'd3';
// a function to generate a user study
// the user study is a list of questions
// each question has a chart, dataset, and a field.

import { ChartType } from "../../components/Offscreen";
import { Fields, Datasets } from "../../App";

export default function generateUserStudy(numUsers = 20) {
    let chartTypes = [...Object.values(ChartType)];

    // generate all possible questions, in the form of a dictionary
    // where the key is the chart type, and the value is a list of questions for that chart type
    let userStudy = {};
    // go through each chart type, and each dataset, and each field
    for (let chartType of chartTypes){
        userStudy[chartType] = [];
        for (let dataset of Object.values(Datasets)){
          if (dataset === Datasets.RANDOM) {
            continue;
          }
            for (let field of Fields[dataset].fields){ 
                // add a question to the user study
                userStudy[chartType].push({
                    //chartType: chartType,
                    dataset: dataset,
                    field: field
                })
            }
        }
    }

    // create a list of users
    let users = {};

    // for each user, create a list of questions
    for (let i = 0; i < numUsers; i++){
        let questions = {};

        // set of used fields
        let usedFields = new Set();

        // add a random question to use from each chart type
        for (let chartType of chartTypes) {
            // get a random question from the user study
            userStudy[chartType] = d3.shuffle(userStudy[chartType]);
            let j = -1;
            while(usedFields.has(userStudy[chartType][++j].field));

            //questions.push(userStudy[chartType][j]);
            questions[chartType] = userStudy[chartType][j];
            usedFields.add(userStudy[chartType][j].field);
        }

        /*let k = -1, h = 0;
        chartTypes = d3.shuffle(chartTypes);
        while(questions.length < questionsPerUser){
            // if we have gone through all the chart types, shuffle them again
            // and start over. Then increment h.
            if(++k >= chartTypes.length){
                chartTypes = d3.shuffle(chartTypes);
                k = 0;
                ++h;
            }
            // get the next chart type
            let chartType = chartTypes[k % chartTypes.length];

            // get the next question from the user study
            let question = userStudy[chartType][h % userStudy[chartType].length];

            // if the question is not already in the list of questions, add it
            if(!questions.includes(question)){
                questions.push({ i: questions.length, ...question });
            }
        };*/
        
        // add questions to the user array
        /*
        users.push({
            user: 100 + i, 
            questions
        });
        */
        users[100 + i] = questions
    }

    // convert the user study to a csv
    console.log(JSON.stringify(users, null, 2))
}

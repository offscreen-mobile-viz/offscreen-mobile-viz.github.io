import * as d3 from 'd3';
// a function to generate a user study
// the user study is a list of questions
// each question has a chart, dataset, and a field.

import { ChartType } from "../../components/Offscreen";
import { Fields, Datasets } from "../../App";

export default function generateUserStudy(numUsers = 10, questionsPerUser = 10) {
    let chartTypes = [...Object.values(ChartType)];

    // generate all possible questions
    let userStudy = {};
    // go through each chart type, and each dataset, and each field
    for (let chartType of Object.values(ChartType)){
        userStudy[chartType] = [];
        for (let dataset of Object.values(Datasets)){
            for (let field of Fields[dataset].fields){ 
                // add a question to the user study
                userStudy[chartType].push({
                    chartType: chartType,
                    dataset: dataset,
                    field: field
                })
            }
        }
    }

    // create a list of users
    let users = [];
    for (let i = 0; i < numUsers; i++){
        let questions = [];

        // add a random question to use from each chart type
        for (let chartType of chartTypes) {
            // get a random question from the user study
            userStudy[chartType] = d3.shuffle(userStudy[chartType]);

            questions.push(userStudy[chartType][0]);
        }

        let k = -1, h = 0;
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
                questions.push(question);
            }
        };
        
        // add questions to the user array
        users.push(questions);
    }

    // print the users
    console.log(users);
}
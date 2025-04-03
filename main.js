// // object + array

// let score = [10, 20, 30, 40, 50];

// for (let i = 0; i < score.length; i++) {
//     console.log("score:", score[i]);
//     // if (score[i] >= 30) {
//     //     newscore.push(score[i]);
//     // }
// }

// let newscore = score.filter((s) => {
//         return s >= 30;

// });

// newscore.forEach((ns) => {
//     console.log("new score:", ns);
// });




// object function

let students = [
    {
        name: "John",
        score: 25,
        grade: 'A'
    }, {
        name: "Doe",
        score: 92,
        grade: 'B'
    }, {
        name: "Fluk",
        score: 61,
        grade: 'F'
    }
];

let student = students.find((s) => {
    return s.name == "Fluk";
});

let highscore = students.filter((s) => {
    return s.score >= 60;
});

console.log("student:", student);
console.log("highscore:", highscore);

const a='5'
const b='2'
const c=a-b

console.log(c)
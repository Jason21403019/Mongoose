const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { Schema } = mongoose;
const fs = require("fs");

app.set("view engine", "ejs");

mongoose
  .connect("mongodb://localhost:27017/exampleDB")
  .then(() => {
    console.log("success connect mongoDB");
  })
  .catch((e) => {
    console.log(e);
  });

const studentSchema = new Schema(
  {
    name: { type: String, require: true },
    age: Number,
    major: {
      type: String,
      require: function () {
        return this.scholarship.merit >= 3000;
      },
    },
    scholarship: {
      merit: Number,
      other: Number,
    },
  },
  {
    statics: {
      findAllMajorStudents(major) {
        return this.find({ major: major }).exec();
      },
    },
  }
);
studentSchema.methods.printTotalScholarship = function () {
  return this.scholarship.merit + this.scholarship.other;
};
studentSchema.pre("save", () => {
  fs.writeFile("record.text", "A new data will be saved...", (e) => {
    if (e) throw e;
  });
});

const Student = mongoose.model("Student", studentSchema); //遞案個parameter為上方製作的Schema

let newStudent = new Student({
  name: "Michael",
  age: 24,
  major: "Mathmatic",
  scholarship: {
    merit: 1000,
    other: 3000,
  },
});
newStudent
  .save()
  .then((data) => {
    console.log("data has been saved.");
  })
  .catch((e) => {
    console.log(e);
  });

// Student.findAllMajorStudents("CS")
//   .then((data) => {
//     console.log(data);
//   })
//   .catch((e) => {
//     console.log(e);
//   });

//列出總獎學金
// Student.find({})
//   .exec()
//   .then((arr) => {
//     arr.forEach((student) => {
//       console.log(
//         student.name +
//           " Total Scholarship is " +
//           student.printTotalScholarship()
//       );
//     });
//   });

//尋找獎學金大於2500的學生
// Student.find({ "scholarship.merit": { $gte: 2500 } })
//   .then((data) => {
//     console.log(data);
//   })
//   .catch((e) => {
//     console.log(e);
//   });

//更新姓名
// Student.updateOne({ name: "Jason Chang" }, { name: "Ethan" })
//   .exec()
//   .then((msg) => {
//     console.log(msg);
//   })
//   .catch((e) => {
//     console.log(e);
//   });
// Student.find()
//   .exec()
//   .then((data) => {
//     console.log(data);
//   })
//   .catch((e) => {
//     console.log(e);
//   });

//在網頁上顯示資料。
// app.get("/", async (req, res) => {
//   try {
//     let data = await Student.findOne({ name: "Ruby" }).exec();
//     res.send(data);
//   } catch (e) {
//     console.log(e);
//   }
// });

// newObject //建立新物件
// const newObject = new Student({
//   name: "Jason",
//   age: 24,
//   major: "CS",
//   scholarship: {
//     merit: 2000,
//     other: 1500,
//   },
// });

//將資料存進mongoDB
//   .save()
//   .then((saveObject) => {
//     console.log("資料儲存完畢。");
//     console.log(saveObject);
//   })
//   .catch((e) => {
//     console.log(e);
//   });

app.listen(3000, () => {
  console.log("server running on port 3000.");
});

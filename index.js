
import bodyParser from "body-parser";

import  express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import mongoose, { connect } from "mongoose";
import _  from "lodash";
const port = 3000;
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));


app.use(express.static("public"));

main().catch(err => console.log(err));



async function main() {

  await mongoose.connect('mongodb://127.0.0.1/todoListDB');

}


const ItemsSchema={
  name:String
};

const Item=mongoose.model("Item",ItemsSchema);


app.set('view engine', 'ejs');



const item1 = new Item({
  name:"Welcome to your Todolist!"
}); 
const item2 = new Item({
  name:"Hit the + button to add a new Item"
}); 
const item3 = new Item({
  name:"<-- Hit this to delete an Item"
}); 

const defaultItems=[item1,item2,item3];


const ListSchema={
  name:String,
  items: [ItemsSchema],
};
const List=mongoose.model("List",ListSchema);

app.get("/:custom",async function (req,res){

 const customName= _.capitalize(req.params.custom);
 const found= await List.findOne({name:customName});
 
 if(found===null){
   const list=new List({
    name:customName,
    items:defaultItems,
   });
   list.save();
   res.redirect("/"+customName);
  

 }else{ res.render("index.ejs",{
  listTitle:found.name,
  listItems:found.items,
});

 }
 
//  const list=new List({
//   name:customName,
//   items:defaultItems,
//  });
//  list.save();
//  res.render("index.ejs",{
//   listTitle:customName,
//   listItems:list.items,





});



app.get("/", async(req, res)=> {

  let data=  await Item.find();
 if(data.length===0){Item.insertMany(defaultItems).then(function () {
  
}).catch(function (err) {
  console.log(err);
});
res.redirect("/")
 }else{
 

  res.render("index.ejs", {
    listTitle: "Personal List",
    listItems: data
  });}
});

// app.get("/work",async(req, res)=>{
 
//   let data =  await Work.find();
//  if(data.length===0){Work.insertMany(defaultItems).then(function () {
//   console.log("Successfully saved defult items to DB");
// }).catch(function (err) {
//   console.log(err);
// });;
// res.redirect("/work")
//  }else{
 

//   res.render("index.ejs", {
//     listTitle: "Work",
//     listItems: data
//   });}
// });

app.post("/delete", async(req, res)=>{
const id=req.body.checkbox;
const listName=req.body.listName;
const itemYes=await Item.findById(id);
if(listName === "Personal"){
  
  await Item.findByIdAndDelete(id);
  res.redirect("/");
}else{
await  List.findOneAndUpdate({name:listName},{$pull:{items:{_id:id}}});
res.redirect("/"+listName);
}
   
  
  
});


app.post("/", async function(req, res){

  // if(req.body.listSubmit === "Work"){
  //   workItems.push(req.body.newTodo);
  //   res.redirect("/work");
  // }else{
  //   listItems.push(req.body.newTodo);
  //   res.redirect("/");
  // }

  const itemName=req.body.newTodo;
  const listName=req.body.listSubmit;
  console.log(itemName);
  console.log(listName);
  
  const item=new Item({
    name:itemName
  });

    if(listName === "Personal"){
 
   
    item.save().then(function () {
      console.log("Successfully saved defult items to DB");
    });
    res.redirect("/")}

    // const itemName=req.body.newTodo;
    // const item=new Work({
    //   name:itemName
    // });
    // item.save().then(function () {
    //   console.log("Successfully saved defult items to DB");
    // });
    // res.redirect("/work");
   
    // const itemName=req.body.newTodo;
    // console.log(itemName);
    // const item=new Item({
    //   name:itemName
    // });
    // item.save().then(function () {
    //   console.log("Successfully saved defult items to DB");
    // });
    // res.redirect("/")
  
  else{
    const found= await List.findOne({name:listName});
    console.log(found);
    found.items.push(item);
    found.save();
    res.redirect("/"+listName);

  }
  });
app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
 
});












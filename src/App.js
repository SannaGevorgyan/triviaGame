import React, { useState, useEffect  } from 'react';
import { Listbox } from '@headlessui/react'

const questionsCount = 10;

const categories = [{type:"Category",value:"none",unavailable:true},
                    {type:"Animals",value:"27",unavailable:false},
                    {type:"History",value:"23",unavailable:false},
                    {type:"Science and nature",value:"17",unavailable:false},
                    {type:"Sports",value:"21",unavailable:false}];

function MyListbox(props) {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [hoverIndex, setHoverIndex] = useState(-1);

  return (
    <Listbox
    value={selectedCategory} onChange={setSelectedCategory}>
      <div className="relative mt-1">
      <Listbox.Button 
        class=" bg-gray-50 w-60 h-10 text-left border rounded-xl border-gray-700" 
      >
      {selectedCategory.type}
      </Listbox.Button>
      <Listbox.Options  
        class=" absolute mt-2 rounded-xl bg-gray-50 w-60 h-44"
        onClick={(event)=>{
          (event.target.value !== "none") && props.SetIsSelectedCategory(true);
          props.selectedCategory(event.target.value,event.target.type);
          }}>
        {categories.map((category,i) => (
          <Listbox.Option 
          class={ " mt-2 ml-2 w-56 h-8 text-sm" + ((hoverIndex === i)?" border rounded-xl text-green-600 bg-gray-200":"")}
          key={category.value}
          value={category}
          hidden={category.unavailable}
          onMouseOver={()=>setHoverIndex(i)}>
            {category.type}
          </Listbox.Option>
        ))}
      </Listbox.Options>
      </div>
    </Listbox>
  )
}

function HomePage(props) {
  const [isSelectedCategory, SetIsSelectedCategory] = useState(false);
  return (
    <div class="grid place-items-center">
      <h1 class="mt-28 text-4xl text-green-700 font-bold"> 
        Trivia App
      </h1>

      <p class="mt-28 mb-6 text-xl font-semibold"> 
        Pich a Category
      </p>
      <MyListbox SetIsSelectedCategory={SetIsSelectedCategory} selectedCategory={props.selectedCategory}/>

        <button 
          className="mt-14 h-10 w-24 rounded-xl  bg-green-600 text-white"
          onClick={props.start}
          disabled={!isSelectedCategory}
        >
          Start
        </button>

        <button
        className="mt-12 w-36 h-10 rounded-xl bg-green-600 text-white"
        onClick={props.previousAnswers}>
        Previous Answers
        </button>

    </div>
  );
}

function QuestionsPage(props) {
  
  const [result, setResult] = useState(0);
  const [index, setIndex] = useState(0);
  const [HoverIndex, setHoverIndex] = useState(-1);
  const [url, setUrl] = useState("https://opentdb.com/api.php?amount=10&category=" + props.categor + "&difficulty=easy&type=multiple&encode=url3986");
  const [questions, setQuestions] = useState([{question:"",correct_answer:"",sorted_answers:[""],user_answer:""}]);
   useEffect(() => {
    fetch(url).then(response => {
      if(response.ok)
        return response.json();
      throw response;
      }) 
    .then(data => {
      let questions = [];
      for(let i = 0; i < questionsCount; i++) {
        let sortedAnswers = [...data.results[i].incorrect_answers,data.results[i].correct_answer]
        .sort()
        .map((element) => decodeURIComponent(element));
        questions.push({
          question: decodeURIComponent(data.results[i].question),
          correct_answer: decodeURIComponent(data.results[i].correct_answer),
          sorted_answers: [...sortedAnswers],
          user_answer:""
        });
      }
      setQuestions(questions);
    }).
    catch(error => (
      console.log(error)
    ))
  },[]);

  let answersButtons;
  if(questions[index].correct_answer !== "") {
    answersButtons = questions[index].sorted_answers.map((answer, i)=> 
    <div>
    <button 
      value = {answer} 
      className={"mb-8 ml-12 rounded-xl font-medium text-center w-48 h-full flex-1" + (HoverIndex===i?" bg-gray-200 text-green-600":" border border-green-800")}
      onMouseOver={()=>setHoverIndex(i)}
      onMouseOut={()=>setHoverIndex(-1)}
      onClick = {(event) => {
        questions[index].user_answer = event.target.value;
        (questions[index].correct_answer === questions[index].user_answer) && (setResult(result+1)); 
        (index + 1 < questionsCount)? setIndex(index+1): props.setResultAndAnswers(result,questions);
      }
      }>
        {answer} 
    </button>
    </div>

  );
}

  return ( 
    <div class="grid place-items-center">
      <h1 class="mt-24 mb-6 text-4xl text-green-700 font-bold "> 
        Questions {index+1}
      </h1>
      <div class="h-6 w-20 rounded-lg rounded-tr-none bg-green-500 text-center text-sm text-white" >
        Easy
      </div>
      <p class="font-bold text-xl mt-10 mb-20 grid place-items-center">
      {questions[index].question}
      </p>
      <div class={"flex"}>
      {answersButtons}
      </div>
    </div>
  );
};

function Answers(props) {
  const [index, setIndex] = useState(0);
  debugger
  let ans = props.answers.previousAnswers[index]
  .sorted_answers
  .map((answer)=> {
    let bg;
    if(answer===props.answers.previousAnswers[index].correct_answer) {
      bg = " bg-green-500 text-white";
    } else if(answer===props.answers.previousAnswers[index].user_answer) {
      bg = " bg-red-600 text-white";
    }
    return (
    <div className={"mb-8 ml-12 rounded-xl font-medium text-center w-48 h-full border border-green-800 " + bg }>
      <p class="mt-6">{answer} </p>
    </div>
    )
  }
  );
  debugger
  return ( 
    <div class="grid place-items-center">
      <h1 class="mt-24 mb-6 text-4xl text-green-700 font-bold "> 
        {"Questions"+(index+1)}
      </h1>
      <div class="h-6 w-20 rounded-lg rounded-tr-none bg-green-500 text-center text-sm text-white" >
        Easy
      </div>
      <p class="font-bold text-xl mt-10 mb-20 grid place-items-center">
      {decodeURIComponent(props.answers.previousAnswers[index].question)}
      </p>
      <div class=" grid grid-cols-4">
        {ans}
      </div>
      <span>
      <button  class="rounded-xl bg-green-600 text-white w-28 h-10 m-10 ml-0"
        onClick={()=>((index - 1) >= 0) && setIndex(index-1)}>
        previous
      </button>
      <button  class="rounded-xl bg-green-600 text-white w-28 h-10"
        onClick={()=>((index + 1 ) < questionsCount) && setIndex(index+1)}>
        next
      </button>
      </span>

    </div>
  );
} 

function ListPreviousAnswers(props) {

const [HoverIndex, setHoverIndex] = useState(-1);
debugger
  return (
    <div>
      {
        props.previousAnswersList.map((result, i)=> 
        <button 
          value = {i} 
          className={"mb-12 mr-10 rounded-xl font-medium text-center w-48 h-full flex-1" + (HoverIndex===i?" bg-gray-200 text-green-600":" border border-green-800")}
          onMouseOver={()=>setHoverIndex(i)}
          onMouseOut={()=>setHoverIndex(-1)}
          onClick = {(event) => {props.setIndex(i); props.setPage("answers");}
          }
        >
          {(i+1) + ".  " + result.result + "/10" } 
        </button>
      )}
    </div>
  )
}

function PreviousAnswers(props) {

  const [page, setPage] = useState("loading");
  const [previousAnswers,setPreviousAnswers] = useState([]);
  const [index,setIndex] = useState(-1);
  const [loadingState,setLoadingState] = useState("Loading...");

  useEffect(() => {
    let previousAnswers = JSON.parse(localStorage.getItem("AnswersHistory"))
    if(previousAnswers) {
      setPreviousAnswers(previousAnswers);
      setPage("previousAnswersList");
    } else {
      setLoadingState("Not found previous answers");
    }
  },[]);

    return (
      <div class ="grid place-items-center">
      { page === "previousAnswersList" && (
      <ListPreviousAnswers 
        setPage={setPage}
        setIndex={setIndex}
        previousAnswersList={previousAnswers}
      />
      )}
  
      { page === "answers" && (
      <Answers 
        answers={previousAnswers[index]}
        backToHome={props.backToHome}
      />
      )}

      { page === "loading" &&
        <div>
          <p class="grid place-items-center mt-28 text-4xl text-green-700 font-bold"> loadingState </p>
        </div>
      }
      <button
        class=" mt-16 w-28 h-10 text-sm rounded-xl font-semibold bg-green-600 text-white"
        onClick={props.backToHome}>
      Back To Home
      </button>
      </div>
    )
}


function ResultPage(props) {
  return(
    <div class="grid place-items-center">
      <p class="mt-24 mb-28 text-4xl text-green-700 font-bold">
        Thank You
      </p>
      <p class="mb-12 text-gray-700 text-xl font-bold ">
        {"Your Score:" + props.resul + "/10"}
      </p>

      <button
        className=" w-28 h-10 text-sm rounded-xl font-semibold bg-green-600 text-white"
        onClick={props.backToHome}>
        Back To Home
      </button>
      
      <button
        className="mt-12 w-36 h-10 rounded-xl bg-green-600 text-white"
        onClick={props.previousAnswers}>
        Previous Answers
      </button>

    </div>
  );
}

function App() {

  const [page, setPage] = useState("home");
  const [category, setCategory] = useState({type:"category",value:"none"});
  const [result, setResult] = useState(0);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
  if(answers.length) {
    let previousAnswers = JSON.parse(localStorage.getItem("AnswersHistory"));
    if(!previousAnswers) {
      localStorage.setItem("AnswersHistory", JSON.stringify([{previousAnswers:answers,result:result,category:category}])); 
    } else {
      previousAnswers.push({previousAnswers:answers,result:result,category:category});
      localStorage.setItem("AnswersHistory", JSON.stringify(previousAnswers));
    }
  }
 },[answers]);

  return (
    <div class="grid place-items-center">
      {
        page === "home" && (
          <HomePage start = {() => setPage("questions")} 
          selectedCategory={(type,value)=>{setCategory({type,value});}}
          previousAnswers={()=>setPage("answers")}
        />
        )
      } 

      {
        page === "questions" && (
        <QuestionsPage 
        categor= {category.value} 
        setResultAndAnswers = {
          (res,answers) => {
            setPage("result"); 
            setResult(res);
            setAnswers(answers)
          }
        }
        />
        )
      } 

      {
        page === "result" && (
          <ResultPage resul={result} 
          backToHome={()=>setPage("home") } 
          previousAnswers={()=>setPage("answers")}/>
        )
      }

      {
        page === "answers" && (
          <PreviousAnswers
            backToHome={()=>setPage("home")} 
          />
        )
      }
    </div>
  );
}

export default App;

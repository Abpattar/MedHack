// --- Symptom Mapping ---
const specialists = [
  {
    name: "Orthopedic",
    keywords: ["knee","bone","joint","fracture","back","shoulder","ankle"]
  },
  {
    name: "Cardiologist",
    keywords: ["chest","heart","palpitation","breathless","pressure"]
  },
  {
    name: "Dermatologist",
    keywords: ["skin","rash","itch","allergy","acne"]
  },
  {
    name: "Dentist",
    keywords: ["tooth","gum","jaw","dental"]
  },
  {
    name: "Neurologist",
    keywords: ["headache","migraine","dizziness","numb","seizure"]
  }
];

// --- Sample Doctor Data (Can Replace With DB Later) ---
let doctors = [
  {id:1,name:"Dr Kumar",specialist:"Orthopedic",price:500},
  {id:2,name:"Dr Mehta",specialist:"Cardiologist",price:800},
  {id:3,name:"Dr Singh",specialist:"Dermatologist",price:600},
  {id:4,name:"Dr Rao",specialist:"Dentist",price:400}
];

function addMessage(text){
  const div=document.createElement("div");
  div.innerHTML=text;
  document.getElementById("chat").appendChild(div);
}

function processInput(){

  let input=document.getElementById("userInput");
  let text=input.value.toLowerCase().trim();

  if(text==="") return;

  addMessage("<b>You:</b> "+input.value);
  input.value="";

  let bestSpecialist="General Physician";
  let maxMatch=0;

  specialists.forEach(spec=>{
    let count=0;

    spec.keywords.forEach(keyword=>{
      if(text.includes(keyword)){
        count++;
      }
    });

    if(count>maxMatch){
      maxMatch=count;
      bestSpecialist=spec.name;
    }
  });

  addMessage("<b>Bot:</b> Recommended Specialist: <b>"+bestSpecialist+"</b>");

  showDoctors(bestSpecialist);
}

function showDoctors(specialist){

  let filtered=doctors.filter(doc=>doc.specialist===specialist);

  if(filtered.length===0){
    addMessage("No doctors found. Please consult General Physician.");
    return;
  }

  addMessage("<b>Available Doctors:</b>");

  filtered.forEach(doc=>{
    addMessage(
      "Name: "+doc.name+
      " | Fee: ₹"+doc.price
    );
  });

  addMessage("<hr>");
}

// Enter key support
document.getElementById("userInput").addEventListener("keypress",function(e){
  if(e.key==="Enter"){
    processInput();
  }
});

addMessage("<b>Bot:</b> Hello! Please describe your symptoms.");
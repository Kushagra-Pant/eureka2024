Nutella = ["nut", "lactose", "vegan"];
Cake = ["lactose", "vegan", "gluten"];
Chicken = ["vegetarian", "vegan"];
Pork = ["vegetarian", "vegan", "kosher", "halal"];
Cheese_Pizza = ["lactose", "vegan", "gluten"];
Pepperoni_Pizza = ["lactose", "vegan", "gluten", "kosher", "halal", "vegetarian"];
Vegetarian_Pizza = ["lactose", "vegan", "gluten"];
Oreo = ["lactose", "vegan"];
Pineapple_Pizza = ["lactose", "vegan", "gluten"];
Double_Bubble = [];
const URL = "https://teachablemachine.withgoogle.com/models/MKSWVgxfT/";
let model, webcam, labelContainer, maxPredictions;
var chosenAllergens = [];
const threshold = 0.6;
var isStopped = false;


async function init() {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        const flip = true; 
        webcam = new tmImage.Webcam(200, 200, flip); 
        await webcam.setup(); 
        await webcam.play();
        window.requestAnimationFrame(loop);

        document.getElementById("webcam-container").appendChild(webcam.canvas);
        labelContainer = document.getElementById("percentage");
        for (let i = 0; i < maxPredictions; i++) {
                labelContainer.appendChild(document.createElement("div"));
        }

        document.getElementById("stopButton").addEventListener("click", handleStop);
        document.getElementById("restartButton").addEventListener("click", handleRestart);
}

async function loop() {
        webcam.update();
        await predict();
        window.requestAnimationFrame(loop);
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);
    let maxClassName = "";
    let maxProbability = 0;

    // Iterate over all predictions to find the highest probability above the threshold
            for (let i = 0; i < prediction.length; i++) {
                if (prediction[i].probability.toFixed(2) > maxProbability) {
                    maxClassName = prediction[i].className;
                    maxProbability = prediction[i].probability.toFixed(2);
                }
            }

    // Update label container only if the highest probability is above the threshold
        if (isStopped == false) {
    if (maxProbability > threshold) {
        document.getElementById("percentage").innerHTML = maxClassName;
    } else {
        document.getElementById("percentage").innerHTML = maxClassName;
    }
        }
}


function handleStop() {
        console.log(chosenAllergens);
        isStopped = true;
        webcam.pause();
        document.getElementById("stopButton").style.display = "none";
        document.getElementById("restartButton").style.display = "block";

        var allergens = getAllergensFromFood(labelContainer.innerHTML);
        if (allergens == "unknown") {
                labelContainer.innerHTML = "aaaaaaaaaa\naaaaa"
        }
        else {
        var foundList = [];
        for(let i = 0; i < allergens.length; i++){
                f = allergens[i];
                if (chosenAllergens.includes(f)) {
                        foundList.push(f);
                }
        }
        console.log(chosenAllergens);
        console.log(allergens);
        console.log(foundList);
        if (foundList.length > 0) {
                labelContainer.innerHTML = "Uh oh, " + labelContainer.innerHTML + " contains:";
                foundList.forEach(a => {labelContainer.innerHTML += "\n" + a});
                //do something here to show that every element of foundList is something they can't eat in the product (labelContainer.innerHTML)
                labelContainer.innerHTML += "\n" + "and as such, is unsafe for you to eat."
                document.getElementsByClassName("button-container")[0].style.backgroundColor = "red";
        } else {
                labelContainer.innerHTML = "Hooray! " + labelContainer.innerHTML + " is safe to eat"
                document.getElementsByClassName("button-container")[0].style.backgroundColor = "green";
                //do something else to show it's safe
                }
        }
}

function getAllergensFromFood(foodName) {
        switch (foodName) {
                case "Nutella": {return Nutella;}
                case "Cake": {return Cake;}
                case "Chicken": {return Chicken;}
                case "Pork": {return Pork;}
                case "Cheese Pizza": {return Cheese_Pizza;}
                case "Pepperoni Pizza": {return Pepperoni_Pizza;}
                case "Vegetarian Pizza": {return Vegetarian_Pizza;}
                case "Oreo": {return Oreo;}
                case "Pineapple Pizza": {return Pineapple_Pizza;}
                case "Double Bubble": {return Double_Bubble;}
                return "unknown";
        }
}


function handleRestart() {
    webcam.play();
    window.requestAnimationFrame(loop);
    document.getElementsByClassName("button-container")[0].style.backgroundColor = "green";
}

function setAllergens(){
        allAllergens = ["lactose", "vegan", "gluten", "kosher", "halal", "vegetarian", "nut"]
        for(let i = 0; i < 7; i++){
                if(document.getElementById(allAllergens[i]).checked){
                        chosenAllergens.push(allAllergens[i])
                }
        }
        console.log(chosenAllergens)
                                
        window.location.href = 'https://afda9c95-50b7-44fb-b66a-a08604c62504-00-1rqitnbfa3lq6.picard.replit.dev/camera_page.html';
}

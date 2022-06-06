//Written by Noah Solano 
//Last update 4/10/22
//Complete

var myInput = document.getElementById("password");
var confirmMyInput = document.getElementById("confirm_password");
var letter = document.getElementById("letter");
var capital = document.getElementById("capital");
var number = document.getElementById("number");
var symbol = document.getElementById("symbol"); 
var length = document.getElementById("length");
var match = document.getElementById("match");

// When the user starts to type something inside the password field
myInput.onkeyup = function validation () 
{

    //Regular Expressions
    var lowerCaseLetters = /[a-z]/g; // Regular expression for lowerCaseLetters
    var upperCaseLetters = /[A-Z]/g; // Regular expression for upperCaseLetters
    var numbers = /[0-9]/g; // Regular expression for digits
    var symbols = /[$@#-/:-?{-~!"^_`\[\]]/g; // Regular expression for symbols
    var minLength = 8; // Minimum length
  
    // Validate lowercase letters
    if (myInput.value.match(lowerCaseLetters)) 
    {
      console.log("inside lower case letters");
      letter.classList.remove("invalid");
      letter.classList.add("valid");
    } 
    else
    {
      letter.classList.remove("valid");
      letter.classList.add("invalid");
    }

    // Validate capital letters
    if (myInput.value.match(upperCaseLetters)) 
    {
      capital.classList.remove("invalid");
      capital.classList.add("valid");
    } 
    else 
    {
      capital.classList.remove("valid");
      capital.classList.add("invalid");
    }

    // Validate numbers
    if (myInput.value.match(numbers)) 
    {
      number.classList.remove("invalid");
      number.classList.add("valid");
    } 
    else 
    {
      number.classList.remove("valid");
      number.classList.add("invalid");
    }

    // Validate symbols
    if (myInput.value.match(symbols)) 
    {
      symbol.classList.remove("invalid");
      symbol.classList.add("valid");
    } 
    else 
    {
      symbol.classList.remove("valid");
      symbol.classList.add("invalid");
    }

    // Validate length
    if (myInput.value.length >= minLength) 
    {
      length.classList.remove("invalid");
      length.classList.add("valid");
    } 
    else 
    {
      length.classList.remove("valid");
      length.classList.add("invalid");
    }
};

  confirmMyInput.onkeyup = function () 
  {
    // Validate password and confirmPassword
    // console.log(confirmMyInput, myInput)
    var passEqualsConfPass = match; // Password & confirm password match
    if (confirmMyInput.value == myInput.value) 
    {
      match.classList.remove("invalid");
      match.classList.add("valid");
    } 
    else 
    {
      match.classList.remove("valid");
      match.classList.add("invalid");
    }

    enableButton(letter, capital, number, length, match);
  };
  
function enableButton(letter, capital, number, length, match) 
{
  var button = document.getElementById("Submit");
  var condition = letter.classList == "valid" && capital.classList == "valid" && number.classList == "valid" && length.classList == "valid" && match.classList == "valid"; 
  if (condition) 
  {
    button.disabled = false;
  }
}

// function onClickFunction() 
// {
//   alert("Password Validated");
// }

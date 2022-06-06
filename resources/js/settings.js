function openUsernameForm() {
    document.getElementById("usernameForm").style.display = "block";
  }
  
  function closeUsernameForm() {
    document.getElementById("usernameForm").style.display = "none";
  }
  function openPasswordForm() {
    document.getElementById("passwordForm").style.display = "block";
  }
  
  function closePasswordForm() {
    document.getElementById("passwordForm").style.display = "none";
  }
  function openEmailForm() {
    document.getElementById("emailForm").style.display = "block";
  }
  
  function closeEmailForm() {
    document.getElementById("emailForm").style.display = "none";
  }
  function openDeleteAccountForm() {
    document.getElementById("deleteAccountForm").style.display = "block";
  }
  
  function closeDeleteAccountForm() {
    document.getElementById("deleteAccountForm").style.display = "none";
  }

function enableButton() {
  var button = document.getElementById("deleteStatusYes");
  var subButton = document.getElementById("deleteSubmit");
  subButton.disabled = true;
  if (button.checked) 
  {
    subButton.disabled = false;
  }
  else{
    subButton.disabled = true;
  }
}

// module.exports = {
// loginAlert: function() {
//   alert("Must be logged in.");
// },
// removedAlert: function() {
//   alert("Account successfully deleted.");
// }
// };

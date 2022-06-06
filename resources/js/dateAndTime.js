function loadEntryDateTime() {
    d = new Date();
    document.getElementById('date').valueAsDate = d;
    var hours = d.getHours();
    var minutes= d.getMinutes();
    var ampm = 'AM';
    if(hours > 12){
        hours=hours-12;
        ampm='PM';
    }
    if(minutes < 10)
    {
        minutes = '0' + minutes;
    }
    document.getElementById('time').value = hours + ":" +  minutes + " " + ampm;
}
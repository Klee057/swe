let autocomplete;

function initAutocomplete() {
    autocomplete = new google.maps.places.Autocomplete(
    document.getElementById("input"),
    {
        types: ['establishment'],
        componentRestrictions: {'country': ['SG']},
        fields: ['place_id', 'geometry', 'name']
    });
}

function specificSearching() {
    var place = autocomplete.getPlace();
    sessionStorage.setItem("locationmarker", JSON.stringify(place));
    window.location.href = './mappage.html';
}

window.onload=function(){
    document.getElementById("testbutton").addEventListener("click", specificSearching);
};
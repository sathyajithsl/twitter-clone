const API_URL = 'http://localhost:5000/tweet';
$( document ).ready(function() {
    viewAllTweets();
    $('.progress').hide();
    var $tweet = $('#tweet');
    var $form = $('.form-group');
    var tweet = {};
    var formData = []
    $tweet.on('click',
        (event) => {
            event.preventDefault();
            $('.form-group').hide();
            $('.progress').show();
            formData = $form.serializeArray();
            tweet = {
                'name' : formData[0].value.toString(),
                'content' : formData[1].value.toString()
            }
            fetch(API_URL,{
                method:'POST',
                body:JSON.stringify(tweet),
                headers:{
                    'content-type': 'application/json'
                }
            }).then(response => response.json())
              .then(createdTweet =>{
                  $('.progress').hide();
                  $form.trigger("reset");
                  setTimeout(() => {
                    $('.form-group').show();
                  }, 30000);
                  viewAllTweets();
              })
        });
});
function viewAllTweets(){
    $('.progress').show();
     fetch(API_URL)
     .then(response => response.json())
     .then(tweets => {
         tweets.reverse();
         var htmlStr='';
         tweets.forEach(tweet => {
            htmlStr += '<h3>'+tweet.name+'</h3><p>'+tweet.content+'</p><small>'+ new Date(tweet.created) +'</small>';
         });
         $('.tweets').html(htmlStr);
         $('.progress').hide();
     })
}
(function(){

function nova_enquesta() {
        var info;
        if(auth_token != "") {
            info = {
                auth_token: auth_token
            }
        }else {
            info = {
                username: username,
                password: password
            }
        }
        $.ajax({
            type: "POST",
            url: "/api/chirper/login",
            contentType: "application/json",
            data: JSON.stringify(info),
            success: function(data) {
                loggedUser = data;
                currentUser = loggedUser;
                document.cookie="chirper_session" + "=" + data.session_token;
                $("#inici").fadeToggle(function() {
                    $("#principal").fadeToggle();
                });
                Main.mainPage();
            },
            error: function(data) {
                renderNotification("error",data.responseText);
            }
        });
    }

    function modificar_enquesta() {
        var info;
        if(auth_token != "") {
            info = {
                auth_token: auth_token
            }
        }else {
            info = {
                username: username,
                password: password
            }
        }
        $.ajax({
            type: "PUT",
            url: "/api/chirper/login",
            contentType: "application/json",
            data: JSON.stringify(info),
            success: function(data) {
                loggedUser = data;
                currentUser = loggedUser;
                document.cookie="chirper_session" + "=" + data.session_token;
                $("#inici").fadeToggle(function() {
                    $("#principal").fadeToggle();
                });
                Main.mainPage();
            },
            error: function(data) {
                renderNotification("error",data.responseText);
            }
        });
    }

var loggedUser = {
    name: "John Doe",
    username: "john_doe",
    avatar: "/img/avatar1.png",
    status: "The average John Doe, whose status is really, really boring."
}

var chirps = []

function renderChirps(){

    function addChirp(chirp){
        var chirpElement = $("#chirpTemplate.template").clone().appendTo("#chirps").removeClass("template");
        $("span.name",chirpElement).text(chirp.author.name);
        $("span.username",chirpElement).text("@" + chirp.author.username);
        $("p",chirpElement).text(chirp.message);
        $("date",chirpElement).text(chirp.date);
        $("img",chirpElement).attr("src",chirp.author.avatar);
    }

    $(chirps).each(function(){
            addChirp(this);
    });
}

function renderLoggedUser(){
    $("header h1").text(loggedUser.name);
    $("header h2").text("@" + loggedUser.username);
    $("header p.status").text(loggedUser.status);
    $("header img").attr("src",loggedUser.avatar)
}

$(function(){

    renderLoggedUser();

    var url = "/api/chirps";
    $.ajax({
        url: url,
        success: function(newChirps,textStatus,jqXHR){
            chirps = newChirps;
            renderChirps();
        },
        dataType: "json",
        error: function(jqXHR, textStatus, error){
            if(jqXHR && jqXHR.status==404){
                $("<p>").addClass("error").text("Error getting the chirps... api server not found at " + url).appendTo("header")
            } else {
                $("<p>").addClass("error").text("Unknown error getting the chirps...").appendTo("header")
            }
            console.debug("Error!",jqXHR)
            console.debug("Text status", textStatus)
            console.debug("Error",error)
        }})
});


})();


$(document).ready(function() {
    $("#inici form.novaEnquesta").submit(function() {
        $.ajax({
            type: "GET",
            url: "/api/enquesta",
            //contentType: "application/json",

            //data: JSON.stringify(),
            success: function(data,textStatus,jqXHR) {
                alert(2)
            },
            //dataType: "json",
            error: function(jqXHR, textStatus, error) {
                alert(3)
            }
        });
    })
});

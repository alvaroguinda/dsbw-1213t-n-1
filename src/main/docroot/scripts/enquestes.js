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

/*function renderLoggedUser(){
    $("header h1").text(loggedUser.name);
    $("header h2").text("@" + loggedUser.username);
    $("header p.status").text(loggedUser.status);
    $("header img").attr("src",loggedUser.avatar)
}*/

$(function(){

    //renderLoggedUser();

    /*var url = "/api/chirps";
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
        }})*/
});


})();

$(document).ready(function() {

    /*$("#inici form.novaEnquesta").submit(function() {
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
    })*/

    $("#inici form.novaEnquesta").submit(function() {
        $("#inici").addClass("template");
        $("#principal.template").removeClass("template");
        $("#formulariEnquesta.template").removeClass("template");
    })



        /*var info;
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
        });*/


    $("#formulariEnquesta form.creaEnquesta").submit(function() {
        
        var enquesta = {
            titol: $("#formulariEnquesta form.creaEnquesta input.inTitol").val(),
            inici: $("#formulariEnquesta form.creaEnquesta input.inDes").val(),
            fi: $("#formulariEnquesta form.creaEnquesta input.inFins").val()
        }

        $.ajax({
            type: "POST",
            url: "/api/enquesta",
            contentType: "application/json",
            data: JSON.stringify(enquesta),
            success: function(data) {
                //$("#inici").addClass("template")
                //$("#principal.template").removeClass("template")
                //$("#formulariEnquesta.template").removeClass("template")
                alert(2);
            },
            error: function(data) {
               //$("#inici").addClass("template")
                //$("#principal.template").removeClass("template")
               // $("#formulariEnquesta.template").removeClass("template")
                alert(1);
            }

        });


    })

    AJAX.getEnquesta = function(idAdmin,idEnquesta,successCallback) {
        $.ajax({
            type: "GET",
            url: "api/enquesta/admin" + idAdmin + "/enq" + idEnquesta,
            //headers: {"X-Auth-Token" : loggedUser.session_token},
            contentType: "application/json",
            success: function(responseData) {
                
            },
            dataType: "json"
        });
    }


    /*$("form.obrirFormulari").submit(function() {   
        $("#formulariEnquesta.template").removeClass("template");
        $("#obrirFormulariButton").addClass("template");
    })

    $("form.enviarNovaEnquesta").submit(function() {
        $("#formulariEnquesta").addClass("template");
        $("#obrirFormulariButton.template").removeClass("template");
    })

    $("form.modificarFormulari").submit(function() {   
        $("#formulariEnquestaModificar.template").removeClass("template");
        $("#modificarFormulariButton").addClass("template");
    })*/
    
});
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

    $("#inici form.novaEnquesta").click(function() {
        $("#inici").addClass("template");
        $("#principal").removeClass("template");
        $("#formulariEnquesta").removeClass("template");
    })


    $("#inici form.getEnquesta").click(activateGetEnquesta)

});

function activateGetEnquesta(){
    $("#inici").addClass("template");
    $("#principal").removeClass("template");
    $("#formulariGetEnquesta").removeClass("template");
}

function gup( name ) {
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( window.location.href );
    if( results == null )
        return "";
    else
        return results[1];
}


function getEnquestaURL(id2) {
        activateGetEnquesta()
        var enquesta = {
            id: id2,
        }
        $.ajax({
            type: "GET",
            url: "/api/enquestes/admin0/enq"+enquesta.id,
            success: function(enquesta) {
                $("#veureEnquesta.template").removeClass("template")
                $("input[name='veureTitol']").val(enquesta.titol)
                $("input[name='veureDesM']").val(enquesta.inici)
                $("input[name='veureFinsM']").val(enquesta.fi)
              //  alert(enquesta.titol);
            },
            dataType: "json",
            error: function(enquesta) {
                //$("#inici").addClass("template")
                //$("#principal.template").removeClass("template")
                //$("#formulariEnquesta.template").removeClass("template")
            }

        });
    }

$(document).ready(function() {
    var id = gup("id")
    if(id != ""){
       getEnquestaURL(id)
    }
    $("#formulariEnquesta form.creaEnquesta").submit(function(e) {
        e.preventDefault(); //D'aquesta manera no fem refresh de la pantalla

        var enquesta = {
            titol: $("#formulariEnquesta form.creaEnquesta input#titol").val(),
            inici: $("#formulariEnquesta form.creaEnquesta input#dataInici").val(),
            fi: $("#formulariEnquesta form.creaEnquesta input#dataFi").val()
        };

        $.ajax({
            type: "POST",
            url: "/api/enquesta",
            contentType: "application/json",
            data: JSON.stringify(enquesta),
            success: function() {
                $("#inici").addClass("template");
                $("#principal").removeClass("template");
                $("#formulariEnquesta").addClass("template");
                $("#veureEnquesta").removeClass("template");
                $("#veureEnquesta form.veureEnquesta input#veureTitol").val(enquesta["titol"]);
                $("#veureEnquesta form.veureEnquesta input#veureDesM").val(enquesta["inici"]);
                $("#veureEnquesta form.veureEnquesta input#veureFinsM").val(enquesta["fi"]);
            },
            error: function(data) {
               //$("#inici").addClass("template")
                //$("#principal.template").removeClass("template")
               // $("#formulariEnquesta.template").removeClass("template")
            }

        });
     })

    $("#formulariGetEnquesta form.getEnquesta").submit(function() {
        var enquesta = {
            id: $("#formulariGetEnquesta form.getEnquesta input#id").val(),
        }

        $.ajax({
            type: "GET",
            url: "/api/enquestes/admin0/enq"+enquesta.id,
            success: function(enquesta) {
                $("#veureEnquesta.template").removeClass("template")
                $("input[name='veureTitol']").val(enquesta.titol)
                $("input[name='veureDesM']").val(enquesta.inici)
                $("input[name='veureFinsM']").val(enquesta.fi)
              //  alert(enquesta.titol);
            },
            dataType: "json",
            error: function(enquesta) {
                //$("#inici").addClass("template")
                //$("#principal.template").removeClass("template")
                //$("#formulariEnquesta.template").removeClass("template")
            }

        });


    })

    $("#veureEnquesta form.veureEnquesta").submit(function() {

        var enquesta2 = {
            id: $("#formulariGetEnquesta form.getEnquesta input#id").val(),
        }
        var enquesta = {
            titol: $("#veureEnquesta form.veureEnquesta input#veureTitol").val(),
            inici: $("#veureEnquesta form.veureEnquesta input#veureDesM").val(),
            fi: $("#veureEnquesta form.veureEnquesta input#veureFinsM").val()
        }
        alert(enquesta.titol);
        $.ajax({
            type: "PUT",
            url: "/api/enquestes/admin0/enq"+enquesta2.id,
            contentType: "application/json",
            data: JSON.stringify(enquesta),
            success: function(data) {
                alert("Modificada! :)");
            },
            error: function(data) {
               alert("FAIL!!");
            }

        });
    })


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


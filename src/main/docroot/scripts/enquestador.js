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

    $("#inici form.getEnquesta").click(function(){
         $("#inici").addClass("template");
         $("#principal").removeClass("template");
         $("#formulariGetEnquesta").removeClass("template");
    }                         )

});


$(document).ready(function() {

    


    $("#formulariEnquesta form.creaEnquesta").submit(function() {

        var enquesta = {
            titol: $("#formulariEnquesta form.creaEnquesta input#titol").val(),
            inici: $("#formulariEnquesta form.creaEnquesta input#dataInici").val(),
            fi: $("#formulariEnquesta form.creaEnquesta input#dataFi").val()
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
                alert("ok");
            },
            error: function(data) {
               //$("#inici").addClass("template")
                //$("#principal.template").removeClass("template")
               // $("#formulariEnquesta.template").removeClass("template")
                alert("ko");
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
                $("#inici").addClass("template")
                $("#principal.template").removeClass("template")
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
               // $("#formulariEnquesta.template").removeClass("template")
                alert("ko");
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
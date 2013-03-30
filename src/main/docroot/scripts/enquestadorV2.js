var Events = {
   inici: function() {
        $("#novaEnquesta").click(function(e) {
        /*
           $("#inici").addClass("template");
           $("#principal").removeClass("template");
           $("#formulariEnquesta").removeClass("template");
        */
            e.preventDefault();
            $("#sectionContainer").empty();
            history.pushState({page:"Nova Enquesta"}, "Nova Enquesta", "NovaEnquesta");
            $("#sectionContainer").load("ajax/crearEnquesta.html", carregarEventHandlers);

        });

        $("#getEnquesta").click(function(e){
        /*
            $("#inici").addClass("template");
            $("#principal").removeClass("template");
            $("#formulariGetEnquesta").removeClass("template");
        */
            e.preventDefault();
            $("#sectionContainer").empty();
            history.pushState({page:"Obtindre Enquesta"}, "Obtindre Enquesta", "ObtindreEnquesta");
            $("#sectionContainer").load("ajax/getEnquesta.html");
       });
   },

   crearEnquesta: function() {
        $("#tornar").click(function(e) {
            e.preventDefault();
            $("#sectionContainer").empty();
            history.pushState({page:"Inici"}, "Inici", "Inici");
            $("#sectionContainer").load("ajax/inici.html", carregarEventHandlers);
        });
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
        });
   },
   getEnquesta: function() {
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


       });
   },
   veureEnquesta: function() {
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
       });
   }
};

var carregarEventHandlers = function(){
    var path = location.pathname.substring(1);
    switch (path){
        case "NovaEnquesta":
            Events.crearEnquesta();
            break;
        default:
            Events.inici();
    }
};

var init = function(){
    $(window).bind("popstate", function(e){
        carregarEventHandlers();
    });
};

$( document ).ready( init );

/*
$(document).ready(function() {

    $("#inici form.novaEnquesta").click(function() {
        $("#inici").addClass("template");
        $("#principal").removeClass("template");
        $("#formulariEnquesta").removeClass("template");
    });

    $("#inici form.getEnquesta").click(function(){
         $("#inici").addClass("template");
         $("#principal").removeClass("template");
         $("#formulariGetEnquesta").removeClass("template");
    });

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
     });

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


    });

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
    });
    
});
*/

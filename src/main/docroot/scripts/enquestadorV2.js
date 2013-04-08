//Map de les seccions de la web cap als fitxers que les contenen:
var secc = {
    Inici : "inici",
    CrearEnquesta : "crearEnquesta",
    ObtindreEnquesta : "getEnquesta",
    VeureEnquesta : "veureEnquesta"
};

//Funció per carregar el contingut de cada secció dinamicament:
var carregaSeccio = function(nomSeccio,data){
    $("#sectionContainer").empty(); //Buidem el DOM relatiu a la secció
    if(!nomSeccio){ //si no hem rebut arguments per carregar una determinada secció...
        var path = location.pathname.substring(1); //capturem el path contingut a la url
        if(!secc[path]){ //si aquet path no existeix al nostre Map es que estem entrant per primer cop a
            path = "Inici"; // la web i la url té el path en blanc o és "index.html", per tant és "Inici"
            history.pushState({page:path}, path, path); //modifiquem la url de la web + l'historic associat del navegador
        }
        $("#sectionContainer").load("ajax/"+secc[path]+".html", configuraSeccio); //carreguem el contingut de la secc. dinamicament
    }
    else{ //si hem rebut arguments es tracta d'un click a un botó que ha de conduir a una determinada secció
        history.pushState({page:nomSeccio}, nomSeccio, nomSeccio); //modifiquem la url de la web + l'historic associat del navegador
        $("#sectionContainer").load("ajax/"+secc[nomSeccio]+".html",function(){configuraSeccio(data);}); //carreguem el contingut de la secc. dinamicament
    }
};

var Events = {
   inici: function() {
        $("#crearEnquesta").click(function(e) {
            e.preventDefault();
            carregaSeccio("CrearEnquesta");
        });

        $("#getEnquesta").click(function(e){
            e.preventDefault();
            carregaSeccio("ObtindreEnquesta");
        });
   },

   crearEnquesta: function() {
        $("#tornar").click(function(e) {
            e.preventDefault();
            carregaSeccio("Inici");
        });

        $("form.creaEnquesta").submit(function(e) {
           e.preventDefault(); //D'aquesta manera no fem refresh de la pantalla

           var enquesta = {
               titol: $("#titol").val(),
               inici: $("#dataInici").val(),
               fi: $("#dataFi").val()
           };

           $.ajax({
               type: "POST",
               url: "/api/enquesta",
               contentType: "application/json",
               data: JSON.stringify(enquesta),
               success: function() {
                   carregaSeccio("VeureEnquesta",enquesta);
               },
               error: function(data) {
                  alert("No s'ha pogut crear l'enquesta.");
               }

           });
        });
   },

   getEnquesta: function() {
        $("#tornar").click(function(e) {
            e.preventDefault();
            carregaSeccio("Inici");
        });

        $("form.getEnquesta").submit(function(e) {
          e.preventDefault();
           var enquesta = {
               id: $("form.getEnquesta input#id").val(),
           }

           $.ajax({
               type: "GET",
               url: "/api/enquestes/admin0/enq"+enquesta.id,
               success: function(enquesta) {
                   carregaSeccio("VeureEnquesta",enquesta);
               },
               dataType: "json",
               error: function(enquesta) {
                   alert("No s'ha pogut obtindre l'enquesta");
               }
           });
        });
   },

   veureEnquesta: function() {
        $("#tornar").click(function(e) {
            e.preventDefault();
            carregaSeccio("Inici");
        });

        $("form.veureEnquesta").submit(function(e) {
           e.preventDefault();
           var enquesta2 = {
               id: $("input#id").val(),
           } // si venim d'haver creat una enquesta nova aquest id no existeix... ¿?¿?

           var enquesta = {
               titol: $("#veureTitol").val(),
               inici: $("#veureDesM").val(),
               fi: $("#veureFinsM").val()
           }
           console.log(enquesta2);
           console.log(enquesta);
           /*
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
*/
        });
   }
};

//Funció de configuració dels diversos elements de la web segons la secció en que ens trobem
var configuraSeccio = function(data){
    var path = location.pathname.substring(1);
    switch (path){
        case "CrearEnquesta":
            initDatePicker();
            Events.crearEnquesta();
            break;
        case "VeureEnquesta":
            $("#veureTitol").val(data["titol"]);
            $("#veureDesM").val(data["inici"]);
            $("#veureFinsM").val(data["fi"]);
            $.each(data.preguntes, function(num,pregunta) {
              $("form.veureEnquesta").append("<p>", num+1, " ")
              $.each(pregunta, function(num2,value){
                $("form.veureEnquesta").append(value, " ")
              });
              $("form.veureEnquesta").append("</p>")
            });
            $("form.veureEnquesta").append("<input type='button' id='afegirPregunta' name='afegirPregunta' value='Afegir pregunta'/>")
            Events.veureEnquesta();
            break;
        case "ObtindreEnquesta":
            Events.getEnquesta();
            break;
        default:
            Events.inici();
    }
};

//Funció d'inicialització de la WebApp
var init = function(){
    //Event que s'executa quan entrem per primer cop a la web o premem les fletxes d'historial de navegació:
    window.onpopstate = function(event) {
        //Carreguem la secció que pertoqui després d'un canvi d'url
        carregaSeccio();
    };
};

$( document ).ready( init );
//Map de les seccions de la web cap als <DIV>s que les contenen:
var secc = {
    Inici : "inici",
    CrearEnquesta : "crearEnquesta",
    ObtindreEnquesta : "getEnquesta",
    Enquesta : "veureEnquesta"
};

var domini = "http://" + location.host + "/";

//Funció per carregar el contingut de cada secció dinamicament:
var carregaSeccio = function(nomSeccio,data){
    var id = "";
    $("#sectionContainer > div").addClass("template"); //Ocultem totes les seccions
    if(!nomSeccio){ //si no hem rebut arguments per carregar una determinada secció...
        var path = location.pathname.substring(1).split("/")[0]; //capturem el path contingut a la url
        if(!secc[path]){ //si aquet path no existeix al nostre Map es que estem entrant per primer cop a la web i la url té el path en blanc o és "index.html"
            id = gup("id");
            if(id != ""){
                path = "Enquesta";
                getEnquestaURL(id);
                id += "/";
            }
            else{
                path = "Inici";
                configuraSeccio(data); //configurem els handlers d'aquesta secció
            }
            history.pushState({page:path}, path, domini+path+"/"+id); //modifiquem la url de la web + l'historic associat del navegador
        }
        $("#"+secc[path]).removeClass("template"); //mostrem la secció segons el path
    }
    else{ //si hem rebut arguments es tracta d'un click a un botó que ha de conduir a una determinada secció
        if(data && data.id) id = data.id+"/"; //si rebem l'id d'una enquesta el concatenarem a la URL
        history.pushState({page:nomSeccio}, nomSeccio, domini+nomSeccio+"/"+id); //modifiquem la url de la web + l'historic associat del navegador
        $("#"+secc[nomSeccio]).removeClass("template"); //mostrem la secció nomSeccio
        configuraSeccio(data); //configurem els handlers d'aquesta secció
    }
};

// Retorna el "value" del parametre amb la key "name" contingut a la URL:
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

// Retorna un Map de tots els parametres continguts a la URL:
function getUrlVars(){
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

// Retorna la enquesta amb ID id en format JSON:
function getEnquestaURL(id){
    var result = null;
    $.ajax({
        type: "GET",
        url: "/api/enquestes/admin0/enq"+id,
        success: function(enquesta) {
            configuraSeccio(enquesta); //configurem els handlers d'aquesta secció
        },
        dataType: "json",
        error: function(enquesta) {
            console.log("Error!");
        }
    });
}

var Events = {
   init: function() {
        //Event que s'executa quan entrem per primer cop a la web o premem les fletxes d'historial de navegació:
       window.onpopstate = function(event) {
           //Carreguem la secció que pertoqui després d'un canvi d'url
           carregaSeccio();
       };

        /*** HOME ***/
        $("#bCrearEnquesta").click(function(e) {
            e.preventDefault();
            carregaSeccio("CrearEnquesta");
        });
        /*
        $("#bGetEnquesta").click(function(e){
            e.preventDefault();
            carregaSeccio("ObtindreEnquesta");
        });
        */


        /*** CREAR ENQUESTA ***/
        initDatePicker();
        $("#crearEnquesta .tornar").click(function(e) {
            e.preventDefault();
            carregaSeccio("Inici");
        });

        $("#formCrearEnquesta").submit(function(e) {
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
               success: function(data) {
                   enquesta.id = data.id;
                   carregaSeccio("Enquesta",enquesta);
                   alert("Enquesta creada amb èxit. Per a accedir a la seva pàgina d'administració a partir d'aquest moment, segueix el següent enllaç \n\nlocalhost:8080?id="+enquesta.id+"\n\nGuarda aquest enllaç i no el perdis, dons és la unica manera d'accedir a l'administració de l'enquesta");
               },
               error: function(data) {
                  alert("No s'ha pogut crear l'enquesta.");
               }
           });
        });

        /*** GET ENQUESTA ***/
        $("#getEnquesta .tornar").click(function(e) {
            e.preventDefault();
            carregaSeccio("Inici");
        });

        $("#formGetEnquesta").submit(function(e) {
          e.preventDefault();
           var enquesta = {
               id: $("#formGetEnquesta input#id").val(),
           }

           $.ajax({
               type: "GET",
               url: "/api/enquestes/admin0/enq"+enquesta.id,
               success: function(enquesta) {
                   carregaSeccio("Enquesta",enquesta);
               },
               dataType: "json",
               error: function(enquesta) {
                   alert("No s'ha pogut obtindre l'enquesta");
               }
           });
        });

        /*** VEURE ENQUESTA ***/
        $("#veureEnquesta .tornar").click(function(e) {
            e.preventDefault();
            carregaSeccio("Inici");
        });

        $("#formVeureEnquesta").submit(function(e) {
           e.preventDefault();
           var enquestaId = getUrlVars()["id"];
           if(!enquestaId) enquestaId = location.pathname.substring(1).split("/")[1];
           var enquesta = {
               titol: $("#veureTitol").val(),
               inici: $("#veureDesM").val(),
               fi: $("#veureFinsM").val()
           }
           console.log(enquesta);

           $.ajax({
               type: "PUT",
               url: "/api/enquestes/admin0/enq"+enquestaId,
               contentType: "application/json",
               data: JSON.stringify(enquesta),
               success: function(data) {
                   //window.location = "http://localhost:8080/";
                   history.pushState({page:"Inici"}, "Inici", domini+"Inici/");
               },
               error: function(data) {
                  alert("FAIL!!");
               }

           });

        });

        $("#bAfegirPreguntes").click(function() {
            $("#afegirPreguntes").removeClass("template");
        });

        $("#formAfegirPreguntes").submit(function(){
            event.preventDefault();
            var enquestaId = getUrlVars()["id"];
            if(!enquestaId) enquestaId = location.pathname.substring(1).split("/")[1];
            var pregunta = {
                tipus: $('#formAfegirPreguntes input[name=tipusPregunta]:checked').val(),
                enunciat: $("#formAfegirPreguntes input#titolPregunta").val()
            }
            console.log(enquestaId);
            console.log(pregunta);

            $.ajax({
                type: "POST",
                url: "/api/enquestes/admin0/enq"+enquestaId,
                contentType: "application/json",
                data: JSON.stringify(pregunta),
                success: function(enquesta){
                    window.location = "http://localhost:8080/?id="+enquestaId
                    //history.pushState({page:"Enquesta"}, "Enquesta", domini+"Enquesta/"+enquestaId+"/");
                },
                error: function(){
                    console.log("Error");
                }
            });
        });
   }
};

//Funció de configuració dels diversos elements de la web segons la secció en que ens trobem
var configuraSeccio = function(data){
    var path = location.pathname.substring(1).split("/")[0];
    //alert("Config. seccio: " + path);
    switch (path){
        case "Enquesta":
            // if(data == null) --> ERROR...
            $("#veureTitol").val(data["titol"]);
            $("#veureDesM").val(data["inici"]);
            $("#veureFinsM").val(data["fi"]);
            if(data.preguntes){
                $.each(data.preguntes, function(num,pregunta) {
                    $("#formVeureEnquesta").append("<p>", num+1, " ");
                    $.each(pregunta, function(num2,value){
                        $("#formVeureEnquesta").append(value, " ");
                    });
                    $("#formVeureEnquesta").append("</p>");
                });
            }
            //$("#formVeureEnquesta").append("<input type='button' id='afegirPregunta' name='afegirPregunta' value='Afegir pregunta'/>");
            break;
        default:
            ;
    }
};

//Funció d'inicialització de la WebApp
$( document ).ready( Events.init );
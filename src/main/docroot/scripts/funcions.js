/*$("#dataInici").datepicker({
    dateFormat: "dd-mm-yy",
    firstDay: 1,
    dayNamesMin: ["Dg", "Dl", "Dt", "Dc", "Dj", "Dv", "Ds"],
    dayNamesShort: ["Dg", "Dl", "Dt", "Dc", "Dj", "Dv", "Ds"],
    monthNames:
        ["Gener", "Febrer", "Març", "Abril", "Maig", "Juny", "Juliol",
        "Agost", "Setembre", "Octubre", "Novembre", "Desembre"],
    monthNamesShort:
        ["Gen", "Feb", "Mar", "Abr", "Mai", "Jun", "Jul",
        "Ago", "Set", "Oct", "Nov", "Dec"]
});*/


//Inicialitzem l'api del calendari
var initDatePicker = function() {

    //datepicker individual
    $( ".datepicker" ).datepicker({ dateFormat: 'dd-mm-yy' });

    //datapicker per fer interval de dates
    $( ".from" ).datepicker({
        dateFormat: 'dd-mm-yy',
        defaultDate: "+1w",
        minDate: new Date(),
        changeMonth: true,
        numberOfMonths: 1,
        showOtherMonths: true,
        selectOtherMonths: true
    });
    
    $( ".to" ).datepicker({
        dateFormat: 'dd-mm-yy',
        defaultDate: "+1w",
        minDate: new Date(),
        changeMonth: true,
        numberOfMonths: 1,
        showOtherMonths: true,
        selectOtherMonths: true
    });
};

//Funcio per fer validacions de formularis
//Per poder validar un formulari hem d'afegir a la declaracio del form class="validarFormulari"
//Per poder fer validacio d'un selector d'un formulari hem d'afegir-li la classe required (class="required")
//En el cas que el formulari tingui un rang de dates i les volguem validar he d'afegir al form
var validaFormulari = function ( form ) {
    var formulari = "#"+form;
    
    //Valida tots els selectors del formulari que tenen class="required"
    $(formulari).validate();
    
    //Valida un rang de dates, afeh¡gir la classe to a la data inici i from a la data de fi
    if(($(formulari).find(".from").length != 0) && ($(formulari).find(".to").length != 0)) {
        var idDataInici = '#'+$(formulari).find(".from").attr('id');
        var idDataFi = '#'+$(formulari).find(".to").attr('id');

        $(formulari).find(".from").rules("add", {
            required: true, 
            dpDate: true,
            catalanDate: true,
            dpCompareDate: ['before', idDataFi] 
        });

        $(formulari).find(".to").rules("add", {
            required: true, 
            dpDate: true,
            catalanDate: true,
            dpCompareDate: {after: idDataInici} 
        });
    }

    //Valida un email, afegir classe email al selector i comprova que tingui @ i .com, .cat, .net, ...
    if($(formulari).find(".email").length != 0) {
        $(formulari).find(".email").rules("add", {
            email: true
        });
    }

};

// Login
var initLogin = (function() {
    var button = $('#loginButton');
    var box = $('#loginBox');
    var form = $('#loginForm');
    button.removeAttr('href');

    //Consultem al servidor si el client tenia una sessio activa i hi figura com autenticat:
    $.ajax({
        type: "GET",
        url: "/api/auth",
        contentType: "application/json",
        success: function(autUser){
            if(autUser){
                $("#login").val("Sign out");
                $("#email").attr("disabled","disabled");
                $("#password").attr("disabled","disabled");
                $("#login").addClass("logout");
                $("#navigation > div").addClass("privAdmin");
                $("#navigation li.admin").removeClass("template");
                console.log("Usuari Autenticat");
            }else{
                console.log("Usuari No Autenticat");
            }
        },
        error: function(){
          console.log("Error");
        }
    });

    button.mouseup(function(login) {
        box.toggle();
        button.toggleClass('active');
    });
    form.mouseup(function() {
        return false;
    });
    form.submit(function(e){
        e.preventDefault();
        if($("#login").hasClass("logout")){
            $.ajax({
                type: "GET",
                url: "/api/logout",
                contentType: "application/json",
                success: function(logoutSucces){
                    console.log("Logout: "+logoutSucces);
                    if(logoutSucces){
                        $("#login").val("Sign in");
                        $("#email").removeAttr("disabled");
                        $("#password").removeAttr("disabled");
                        $("#login").removeClass("logout");
                        $("#navigation > div").removeClass("privAdmin");
                        $("#navigation li.admin").addClass("template");
                        console.log("Logout OK");
                    }else{
                        console.log("Logout Failed");
                    }
                },
                error: function(){
                  console.log("Error");
                }
            });
        }
        else{
            var email = $("#email").val();
            var pass = $("#password").val();
            $.ajax({
                type: "GET",
                url: "/api/login?user="+email+"&pass="+pass,
                contentType: "application/json",
                success: function(loginSucces){
                    console.log("Login: "+loginSucces);
                    if(loginSucces){
                        if(!$("#loginFailed").hasClass("template")) $("#loginFailed").addClass("template");
                        $("#login").val("Sign out");
                        $("#email").attr("disabled","disabled");
                        $("#password").attr("disabled","disabled");
                        $("#login").addClass("logout");
                        $("#navigation > div").addClass("privAdmin");
                        $("#navigation li.admin").removeClass("template");
                        console.log("Login OK");
                    }else{
                        $("#loginFailed").removeClass("template");
                        console.log("Login Failed");
                    }
                },
                error: function(){
                  console.log("Error");
                }
            });
        }
    });
    $(this).mouseup(function(login) {
        if(!($(login.target).parent('#loginButton').length > 0)) {
            button.removeClass('active');
            box.hide();
        }
    });

});

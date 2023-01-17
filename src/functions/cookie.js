export async function setCookies(value) {
    var d = new Date();
    d.setTime(d.getTime() + (60 * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString() + ";";

    document.cookie = "downloaded=" + value + ";" + expires;


}

export async function getCookies() {

    var cookies = document.cookie.split(";")
    for (var i = 0; i < cookies.length; i++) {
        while (cookies[i].charAt(0) === ' ') {
            cookies[i] = cookies[i].substring(1);
        }
        if (cookies[i].indexOf("downloaded") === 0) {
            var codeSaved = cookies[i].split('=')[1]
            console.log("Cookie found: " + codeSaved)
            return codeSaved;
        }
    }

}

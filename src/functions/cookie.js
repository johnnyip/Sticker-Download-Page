export async function setCookies(value) {
    let d = new Date();
    d.setTime(d.getTime() + (60 * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString() + ";";

    document.cookie = "downloaded=" + value + ";" + expires;


}

export async function getCookies() {

    let cookies = document.cookie.split(";")
    for (let i = 0; i < cookies.length; i++) {
        while (cookies[i].charAt(0) === ' ') {
            cookies[i] = cookies[i].substring(1);
        }
        if (cookies[i].indexOf("downloaded") === 0) {
            let codeSaved = cookies[i].split('=')[1]
            console.log("Cookie found: " + codeSaved)
            return codeSaved;
        }
    }

}

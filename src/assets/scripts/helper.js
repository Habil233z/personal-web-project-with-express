let base64String = "";
            function imageUploaded() {
                console.log("testing")
            let file = document.querySelector(
                'input[type=file]')['files'][0];

            let reader = new FileReader();

            reader.onload = function () {
                base64String = reader.result

                imageBase64Stringsep = base64String;

                console.log(base64String);
            }
            reader.readAsDataURL(file);
        }
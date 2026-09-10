/* =====================================================
   MEDIA STORAGE — INDEXEDDB
===================================================== */

const MEDIA_DB_NAME = "BirthdayScrapbookMedia";
const MEDIA_STORE_NAME = "media";

function openMediaDB() {

    return new Promise((resolve, reject) => {

        const request =
            indexedDB.open(MEDIA_DB_NAME, 1);

        request.onupgradeneeded = function (event) {

            const db = event.target.result;

            if (!db.objectStoreNames.contains(MEDIA_STORE_NAME)) {

                db.createObjectStore(
                    MEDIA_STORE_NAME
                );

            }

        };

        request.onsuccess = function () {

            resolve(request.result);

        };

        request.onerror = function () {

            reject(request.error);

        };

    });

}


function saveMedia(key, file) {

    return openMediaDB().then(db => {

        return new Promise((resolve, reject) => {

            const transaction =
                db.transaction(
                    MEDIA_STORE_NAME,
                    "readwrite"
                );

            const store =
                transaction.objectStore(
                    MEDIA_STORE_NAME
                );

            store.put(file, key);

            transaction.oncomplete = function () {

                resolve();

            };

            transaction.onerror = function () {

                reject(transaction.error);

            };

        });

    });

}


function getMedia(key) {

    return openMediaDB().then(db => {

        return new Promise((resolve, reject) => {

            const transaction =
                db.transaction(
                    MEDIA_STORE_NAME,
                    "readonly"
                );

            const store =
                transaction.objectStore(
                    MEDIA_STORE_NAME
                );

            const request =
                store.get(key);

            request.onsuccess = function () {

                resolve(request.result);

            };

            request.onerror = function () {

                reject(request.error);

            };

        });

    });

}


function deleteMedia(key) {

    return openMediaDB().then(db => {

        return new Promise((resolve, reject) => {

            const transaction =
                db.transaction(
                    MEDIA_STORE_NAME,
                    "readwrite"
                );

            const store =
                transaction.objectStore(
                    MEDIA_STORE_NAME
                );

            store.delete(key);

            transaction.oncomplete = function () {

                resolve();

            };

            transaction.onerror = function () {

                reject(transaction.error);

            };

        });

    });

}


/* =====================================================
   BIRTHDAY SCRAPBOOK - ADMIN EDITOR
===================================================== */

const STORAGE_KEY = "birthdayScrapbookData";


/* =====================================================
   DEFAULT DATA
===================================================== */

const defaultData = {

    loveNote: "Things I love about you",

loveTitle: "Why I Love You",

loveTitle1: "♡ Your personality",
loveText1: "Write something here about the way they are and what makes them special.",

loveTitle2: "♡ The way you make me feel",
loveText2: "Write something personal here.",

loveTitle3: "♡ The little things",
loveText3: "The small things they do that you secretly love.",

    coverNote:
        "A little world made just for you",

    coverTitle1:
        "Happy Birthday,",

    coverTitle2:
        "My Love",

    openWhenSad: 
    "Write your message here.",
    
    openWhenMiss: 
    "Write your message here.",
    
    openWhenReminder: 
    "Write something sweet here.",

    coverMessage:
        "Every memory with you feels like my favorite page. This is a small scrapbook of us.",


    beginningTitle:
        "The day I started having feelings",

    beginningText:
        "Right after that day, I started to have feelings for you. I was so confused, and I made sure that maybe it wasn't just infatuation. But then I realized that I really liked you, and I started to value your presence more and more. I was scared to tell you because I didn't know if you felt the same way. But eventually, I just wanted you to know... I like you.",


    beginningTitle2:
        "Home is wherever you are",

    beginningText2:
        "I love being around you. I feel at ease, and I feel like I can completely be myself around you. Thank you for letting me stay by your side, for being my safe place, my comfort zone, my best friend, my love, and my everything.",


    captions: [
        "Our favorite day",
        "A random moment",
        "Something I'll never forget",
        "Just us",
        "One of my favorite memories",
        "A day I wish I could repeat",
        "Our silly moment",
        "A memory worth keeping",
        "Another little memory",
        "Forever one of my favorites"
    ],


    spotifyLinks: [
    "",
    "",
    ""
],


    letterText:
        "My love,\n\nWrite your birthday letter here.\n\nTell them everything you want them to know.\n\nLove,\nYour Maxim ♡"
};


/* =====================================================
   LOAD DATA
===================================================== */

function loadData() {

    const savedData =
        localStorage.getItem(STORAGE_KEY);

    if (!savedData) {
        return structuredClone(defaultData);
    }

    try {

        return {
            ...structuredClone(defaultData),
            ...JSON.parse(savedData)
        };

    } catch (error) {

        console.error(
            "Could not load saved scrapbook data:",
            error
        );

        return structuredClone(defaultData);
    }
}


/* =====================================================
   SAVE DATA
===================================================== */

function saveData(data) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
    );
}


/* =====================================================
   GET INPUT VALUE
===================================================== */

function getValue(id) {

    const element =
        document.getElementById(id);

    return element
        ? element.value
        : "";
}


/* =====================================================
   SET INPUT VALUE
===================================================== */

function setValue(id, value) {

    const element =
        document.getElementById(id);

    if (element) {
        element.value = value || "";
    }
}


/* =====================================================
   LOAD DATA INTO EDITOR
===================================================== */

function populateEditor() {

    const data = loadData();


    setValue(
        "cover-note",
        data.coverNote
    );

    setValue(
    "love-note",
    data.loveNote || ""
);

setValue(
    "love-title",
    data.loveTitle || ""
);

setValue(
    "love-title-1",
    data.loveTitle1 || ""
);

setValue(
    "love-text-1",
    data.loveText1 || ""
);

setValue(
    "love-title-2",
    data.loveTitle2 || ""
);

setValue(
    "love-text-2",
    data.loveText2 || ""
);

setValue(
    "love-title-3",
    data.loveTitle3 || ""
);

setValue(
    "love-text-3",
    data.loveText3 || ""
);


    setValue(
    "cover-title",
    data.coverTitle1
);

setValue(
    "cover-title-2",
    data.coverTitle2
);

setValue(
    "open-when-sad", 
    data.openWhenSad
);

setValue(
    "open-when-miss", 
    data.openWhenMiss
);

setValue(
    "open-when-reminder", 
    data.openWhenReminder
);


    setValue(
        "cover-message",
        data.coverMessage
    );


    setValue(
        "beginning-title",
        data.beginningTitle
    );


    setValue(
        "beginning-text",
        data.beginningText
    );


    setValue(
        "beginning-title-2",
        data.beginningTitle2
    );


    setValue(
        "beginning-text-2",
        data.beginningText2
    );


setValue(
    "spotify-link-1",
    data.spotifyLinks?.[0] || ""
);

setValue(
    "spotify-link-2",
    data.spotifyLinks?.[1] || ""
);

setValue(
    "spotify-link-3",
    data.spotifyLinks?.[2] || ""
);


    setValue(
        "letter-text",
        data.letterText
    );


    const captionInputs =
        document.querySelectorAll(
            ".caption-input"
        );


    captionInputs.forEach(
        (input, index) => {

            input.value =
                data.captions[index] || "";

        }
    );

    const savedCoverPhoto =
    localStorage.getItem("birthdayCoverPhoto");

const coverPhotoPreview =
    document.getElementById("cover-photo-preview");

if (savedCoverPhoto && coverPhotoPreview) {

    coverPhotoPreview.innerHTML = `
        <img
            src="${savedCoverPhoto}"
            alt="Saved cover photo"
            style="
                width: 100%;
                max-width: 400px;
                margin-top: 15px;
                border-radius: 12px;
            "
        >
    `;

}

}


/* =====================================================
   COLLECT DATA FROM EDITOR
===================================================== */

function collectData() {

    const currentData =
        loadData();


    const captionInputs =
        document.querySelectorAll(
            ".caption-input"
        );


    const captions =
        [...captionInputs].map(
            input => input.value.trim()
        );


    return {

        ...currentData,

        loveNote:
    getValue("love-note").trim(),

loveTitle:
    getValue("love-title").trim(),

loveTitle1:
    getValue("love-title-1").trim(),

loveText1:
    getValue("love-text-1").trim(),

loveTitle2:
    getValue("love-title-2").trim(),

loveText2:
    getValue("love-text-2").trim(),

loveTitle3:
    getValue("love-title-3").trim(),

loveText3:
    getValue("love-text-3").trim(),

        coverNote:
            getValue("cover-note").trim(),

        coverTitle1:
    getValue("cover-title").trim(),

coverTitle2:
    getValue("cover-title-2").trim(),

openWhenSad: 
    getValue("open-when-sad"),

openWhenMiss: 
    getValue("open-when-miss"),

openWhenReminder: 
getValue("open-when-reminder"),

coverMessage:
    getValue("cover-message").trim(),


        beginningTitle:
            getValue("beginning-title").trim(),

        beginningText:
            getValue("beginning-text").trim(),

        beginningTitle2:
            getValue("beginning-title-2").trim(),

        beginningText2:
            getValue("beginning-text-2").trim(),


        captions,


spotifyLinks: [
    getValue("spotify-link-1").trim(),
    getValue("spotify-link-2").trim(),
    getValue("spotify-link-3").trim()
],


        letterText:
            getValue("letter-text").trim()
    };
}


/* =====================================================
   SAVE BUTTON
===================================================== */

const saveButton =
    document.getElementById(
        "save-button"
    );

const saveStatus =
    document.getElementById(
        "save-status"
    );


if (saveButton) {

    saveButton.addEventListener(
        "click",
        () => {

            const data =
                collectData();

            saveData(data);


            saveStatus.textContent =
                "✓ Changes saved successfully!";


            setTimeout(() => {

                saveStatus.textContent =
                    "";

            }, 3000);

        }
    );
}


/* =====================================================
   RESET BUTTON
===================================================== */

const resetButton =
    document.getElementById(
        "reset-button"
    );


if (resetButton) {

    resetButton.addEventListener(
        "click",
        () => {

            const confirmed =
                confirm(
                    "Reset all editor content to the original version?"
                );


            if (!confirmed) {
                return;
            }


            localStorage.removeItem(
                STORAGE_KEY
            );


            populateEditor();


            saveStatus.textContent =
                "Content reset.";
        }
    );
}


/* =====================================================
   START
===================================================== */

populateEditor();


/* =====================================================
   RESTORE SAVED MEDIA PREVIEWS
   ===================================================== */

function restoreMediaPreviews() {

    /* PHOTO 1 + 2 — localStorage */
    for (let i = 1; i <= 2; i++) {

        const savedPhoto =
            localStorage.getItem(`birthdayPhoto${i}`);

        const preview =
            document.getElementById(`photo-preview-${i}`);

        if (savedPhoto && preview) {

            preview.innerHTML = `
                <img
                    src="${savedPhoto}"
                    alt="Saved Photo ${i}"
                    style="
                        max-width: 200px;
                        margin-top: 10px;
                        border-radius: 10px;
                    "
                >
            `;

        }

    }


    /* PHOTO 3 - 10 — IndexedDB */
    for (let i = 3; i <= 10; i++) {

        const preview =
            document.getElementById(`photo-preview-${i}`);

        if (!preview) {
            continue;
        }

        getMedia(`birthdayPhoto${i}`)
            .then(file => {

                if (!file) {
                    return;
                }

                const imageURL =
                    URL.createObjectURL(file);

                preview.innerHTML = `
                    <img
                        src="${imageURL}"
                        alt="Saved Photo ${i}"
                        style="
                            max-width: 200px;
                            margin-top: 10px;
                            border-radius: 10px;
                        "
                    >
                `;

            })
            .catch(error => {
                console.error(
                    `Could not restore Photo ${i} preview:`,
                    error
                );
            });

    }


    /* VIDEO 1 — IndexedDB */
    const savedVideoPreview =
        document.getElementById("video-preview-1");

    if (savedVideoPreview) {

        getMedia("birthdayVideo1")
            .then(file => {

                if (!file) {
                    return;
                }

                const videoURL =
                    URL.createObjectURL(file);

                savedVideoPreview.innerHTML = `
                    <video
                        src="${videoURL}"
                        controls
                        playsinline
                        style="
                            width: 100%;
                            max-width: 500px;
                            margin-top: 15px;
                            border-radius: 12px;
                        "
                    ></video>
                `;

            })
            .catch(error => {
                console.error(
                    "Could not restore Video 1 preview:",
                    error
                );
            });

    }

}


restoreMediaPreviews();


/* =====================================================
   PHOTO 1 PREVIEW
===================================================== */

const photoInput = document.getElementById("photo-1");
const photoPreview = document.getElementById("photo-preview-1");

if (photoInput && photoPreview) {

    photoInput.addEventListener("change", function () {

        const file = this.files[0];

        if (!file) {
            return;
        }

        const imageURL = URL.createObjectURL(file);

        photoPreview.innerHTML = `
            <img
                src="${imageURL}"
                alt="Photo 1 preview"
                style="max-width: 200px; margin-top: 10px; border-radius: 10px;"
            >
        `;

    });

}


/* =====================================================
   SEND PHOTO 1 TO SCRAPBOOK
===================================================== */

if (photoInput) {

    photoInput.addEventListener("change", function () {

        const file = this.files[0];

        if (!file) {
            return;
        }

const reader = new FileReader();

reader.onload = function (event) {

    localStorage.setItem(
        "birthdayPhoto1",
        event.target.result
    );

};

reader.readAsDataURL(file);

    });

}


/* =====================================================
   PHOTO 2 PREVIEW + SAVE
===================================================== */

const photoInput2 = document.getElementById("photo-2");
const photoPreview2 = document.getElementById("photo-preview-2");

if (photoInput2 && photoPreview2) {

    photoInput2.addEventListener("change", function () {

        const file = this.files[0];

        if (!file) {
            return;
        }

        // Show preview
        const imageURL = URL.createObjectURL(file);

        photoPreview2.innerHTML = `
            <img
                src="${imageURL}"
                alt="Photo 2 preview"
                style="max-width: 200px; margin-top: 10px; border-radius: 10px;"
            >
        `;

        // Save image permanently for this browser
        const reader = new FileReader();

        reader.onload = function (event) {

            localStorage.setItem(
                "birthdayPhoto2",
                event.target.result
            );

        };

        reader.readAsDataURL(file);

    });

}


/* =====================================================
   PHOTO 3 - 10 PREVIEW + SAVE
   Using IndexedDB
===================================================== */

for (let i = 3; i <= 10; i++) {

    const photoInput =
        document.getElementById(`photo-${i}`);

    const photoPreview =
        document.getElementById(`photo-preview-${i}`);

    if (photoInput && photoPreview) {

        photoInput.addEventListener(
            "change",
            async function () {

                const file = this.files[0];

                if (!file) {
                    return;
                }

                /* Show preview immediately */
                const imageURL =
                    URL.createObjectURL(file);

                photoPreview.innerHTML = `
                    <img
                        src="${imageURL}"
                        alt="Photo ${i} preview"
                        style="
                            max-width: 200px;
                            margin-top: 10px;
                            border-radius: 10px;
                        "
                    >
                `;

                /* Save the actual file in IndexedDB */
                try {

                    await saveMedia(
                        `birthdayPhoto${i}`,
                        file
                    );

                    console.log(
                        `✓ PHOTO ${i} SAVED`
                    );

                } catch (error) {

                    console.error(
                        `PHOTO ${i} COULD NOT BE SAVED:`,
                        error
                    );

                    alert(
                        `Photo ${i} could not be saved.`
                    );

                }

            }
        );

    }

}


/* =====================================================
   VIDEO 1 PREVIEW + SAVE
   Using IndexedDB
   Maximum duration: 3 minutes
===================================================== */

const videoInput =
    document.getElementById("video-1");

const videoPreview =
    document.getElementById("video-preview-1");

if (videoInput && videoPreview) {

    videoInput.addEventListener(
        "change",
        function () {

            const file = this.files[0];

            if (!file) {
                return;
            }

            /*
                Create temporary URL
                so we can check the video duration.
            */
            const videoURL =
                URL.createObjectURL(file);

            const testVideo =
                document.createElement("video");

            testVideo.preload = "metadata";

            testVideo.onloadedmetadata =
                async function () {

                    URL.revokeObjectURL(videoURL);

                    /*
                        Check video duration
                    */
                    if (
                        !Number.isFinite(
                            testVideo.duration
                        )
                    ) {

                        alert(
                            "Could not determine the video duration."
                        );

                        videoInput.value = "";

                        return;
                    }

                    /*
                        Maximum: 3 minutes
                    */
                    if (
    testVideo.duration > 180
) {

    alert(
        "Video must be 3 minutes or shorter."
    );

                        videoInput.value = "";

                        videoPreview.innerHTML = "";

                        return;
                    }

                    /*
                        Show preview
                    */
                    const previewURL =
                        URL.createObjectURL(file);

                    videoPreview.innerHTML = `
                        <video
                            src="${previewURL}"
                            controls
                            playsinline
                            style="
                                width: 100%;
                                max-width: 500px;
                                margin-top: 15px;
                                border-radius: 12px;
                            "
                        ></video>
                    `;

                    /*
                        Save video to IndexedDB
                    */
                    try {

                        await saveMedia(
                            "birthdayVideo1",
                            file
                        );

                        console.log(
                            "✓ VIDEO 1 SAVED"
                        );

                    } catch (error) {

                        console.error(
                            "VIDEO 1 COULD NOT BE SAVED:",
                            error
                        );

                        alert(
                            "The video could not be saved."
                        );

                    }

                };

            testVideo.onerror =
                function () {

                    URL.revokeObjectURL(videoURL);

                    alert(
                        "This video could not be read."
                    );

                    videoInput.value = "";

                };

            testVideo.src = videoURL;

        }
    );

}


/* =====================================================
   COVER PHOTO PREVIEW + SAVE
===================================================== */

const coverPhotoInput =
    document.getElementById("cover-photo");

const coverPhotoPreview =
    document.getElementById("cover-photo-preview");

if (coverPhotoInput && coverPhotoPreview) {

    coverPhotoInput.addEventListener("change", function () {

        const file = this.files[0];

        if (!file) {
            return;
        }

        /* Show preview */
        const imageURL =
            URL.createObjectURL(file);

        coverPhotoPreview.innerHTML = `
            <img
                src="${imageURL}"
                alt="Cover photo preview"
                style="
                    width: 100%;
                    max-width: 400px;
                    margin-top: 15px;
                    border-radius: 12px;
                "
            >
        `;

        /* Save image */
        const reader = new FileReader();

        reader.onload = function (event) {

            localStorage.setItem(
                "birthdayCoverPhoto",
                event.target.result
            );

            console.log("✓ COVER PHOTO SAVED");
        };

        reader.onerror = function () {
            console.error(
                "Cover photo could not be read."
            );
        };

        reader.readAsDataURL(file);

    });

}


/* =====================================================
   REMOVE COVER PHOTO
===================================================== */

const removeCoverPhotoButton =
    document.getElementById("remove-cover-photo");

if (removeCoverPhotoButton) {

    removeCoverPhotoButton.addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "birthdayCoverPhoto"
            );

            const coverPhotoPreview =
                document.getElementById(
                    "cover-photo-preview"
                );

            const coverPhotoInput =
                document.getElementById(
                    "cover-photo"
                );

            if (coverPhotoPreview) {
                coverPhotoPreview.innerHTML = "";
            }

            if (coverPhotoInput) {
                coverPhotoInput.value = "";
            }

            alert("Cover photo removed.");

        }
    );

}
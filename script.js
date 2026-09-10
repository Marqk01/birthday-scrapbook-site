/* =====================================================
   MEDIA STORAGE — INDEXEDDB
===================================================== */

const MEDIA_DB_NAME = "BirthdayScrapbookMedia";
const MEDIA_STORE_NAME = "media";

function openMediaDB() {

    return new Promise((resolve, reject) => {

        const request =
            indexedDB.open(MEDIA_DB_NAME, 1);

        request.onsuccess = function () {
            resolve(request.result);
        };

        request.onerror = function () {
            reject(request.error);
        };

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


/* =====================================================
   FALLING PETALS
===================================================== */

const petalsContainer = document.querySelector(".petals");

for (let i = 0; i < 28; i++) {

    const petal = document.createElement("span");

    petal.className = "petal";

    petal.style.setProperty(
        "--left",
        `${Math.random() * 100}%`
    );

    petal.style.setProperty(
        "--size",
        `${8 + Math.random() * 14}px`
    );

    petal.style.setProperty(
        "--opacity",
        `${0.35 + Math.random() * 0.45}`
    );

    petal.style.setProperty(
        "--blur",
        `${Math.random() * 1.2}px`
    );

    petal.style.setProperty(
        "--duration",
        `${8 + Math.random() * 8}s`
    );

    petal.style.setProperty(
        "--delay",
        `${Math.random() * -15}s`
    );

    petal.style.setProperty(
        "--drift",
        `${-120 + Math.random() * 240}px`
    );

    petalsContainer.appendChild(petal);
}



/* =====================================================
   SCRAPBOOK PAGES
===================================================== */

const bookPages = [
    ...document.querySelectorAll(".scrapbook-page")
];

let currentPage = 0;
let isTurning = false;



/* =====================================================
   PAGE CONTROLS
===================================================== */

const bookControls = document.createElement("nav");

bookControls.className = "book-controls";

bookControls.innerHTML = `
    <button
        class="book-button previous-page"
        aria-label="Previous page"
    >
        ← Back
    </button>

    <span class="page-count"></span>

    <button
        class="book-button next-page"
        aria-label="Next page"
    >
        Next page →
    </button>
`;

document.body.appendChild(bookControls);



const previousButton =
    bookControls.querySelector(".previous-page");

const nextButton =
    bookControls.querySelector(".next-page");

const pageCount =
    bookControls.querySelector(".page-count");



/* =====================================================
   PREPARE PAGES
===================================================== */

bookPages.forEach((page, index) => {

    page.classList.add("book-page");

    page.setAttribute(
        "aria-label",
        `Scrapbook page ${index + 1}`
    );

});



/* =====================================================
   UPDATE CONTROLS
===================================================== */

function updateBookControls() {

    previousButton.disabled =
        currentPage === 0;

    pageCount.textContent =
        `Page ${currentPage + 1} of ${bookPages.length}`;

    nextButton.textContent =
        currentPage === bookPages.length - 1
            ? "Read again ♡"
            : "Next page →";
}



/* =====================================================
   REAL SCRAPBOOK PAGE TURN
===================================================== */

function turnToPage(
    nextPage,
    direction = "next"
) {

    if (
        isTurning ||
        nextPage === currentPage ||
        nextPage < 0 ||
        nextPage >= bookPages.length
    ) {
        return;
    }


    isTurning = true;


    const current =
        bookPages[currentPage];

    const next =
        bookPages[nextPage];


    /* -------------------------------------------------
       Prepare the next page underneath
    ------------------------------------------------- */

    next.classList.add("page-under");


    /* -------------------------------------------------
       Give the browser one frame to place the page
       underneath before starting the flip
    ------------------------------------------------- */

    requestAnimationFrame(() => {

        current.classList.remove("active");


        current.classList.add(
            direction === "next"
                ? "turning-forward"
                : "turning-back"
        );


        /* -------------------------------------------------
           Wait for the physical page flip
        ------------------------------------------------- */

        window.setTimeout(() => {

            current.classList.remove(
                "turning-forward",
                "turning-back"
            );


            next.classList.remove(
                "page-under"
            );


            next.classList.add(
                "active"
            );


            currentPage =
                nextPage;


            updateBookControls();


            window.scrollTo({
                top: 0,
                behavior: "instant"
            });


            isTurning = false;


        }, 1050);

    });
}



/* =====================================================
   FIRST PAGE
===================================================== */

bookPages[0].classList.add("active");

updateBookControls();



/* =====================================================
   OPEN SURPRISE BUTTON
===================================================== */

document
    .getElementById("enter-button")
    .addEventListener("click", () => {

        turnToPage(1);

    });



/* =====================================================
   NEXT BUTTON
===================================================== */

nextButton.addEventListener(
    "click",
    () => {

        if (
            currentPage ===
            bookPages.length - 1
        ) {

            turnToPage(0, "back");

            return;
        }

        turnToPage(
            currentPage + 1
        );

    }
);



/* =====================================================
   BACK BUTTON
===================================================== */

previousButton.addEventListener(
    "click",
    () => {

        turnToPage(
            currentPage - 1,
            "back"
        );

    }
);



/* =====================================================
   KEYBOARD NAVIGATION
===================================================== */

document.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "ArrowRight") {
            nextButton.click();
        }

        if (event.key === "ArrowLeft") {
            previousButton.click();
        }

    }
);




/* =====================================================
   LOAD ADMIN DATA INTO SCRAPBOOK
===================================================== */

const STORAGE_KEY = "birthdayScrapbookData";

function loadScrapbookData() {

    const saved =
        localStorage.getItem(STORAGE_KEY);

    if (!saved) {
        return null;
    }

    try {

        return JSON.parse(saved);

    } catch (error) {

        console.error(
            "Could not load scrapbook data:",
            error
        );

        return null;
    }
}


function applyScrapbookData() {

    const data =
        loadScrapbookData();

    if (!data) {
        return;
    }

    const sadMessage = document.querySelector("#letter-sad p");

if (sadMessage && data.openWhenSad) {
    sadMessage.textContent = data.openWhenSad;
}


const missMessage = document.querySelector("#letter-miss p");

if (missMessage && data.openWhenMiss) {
    missMessage.textContent = data.openWhenMiss;
}


const reminderMessage = document.querySelector("#letter-reminder p");

if (reminderMessage && data.openWhenReminder) {
    reminderMessage.textContent = data.openWhenReminder;
}
    


    /* =========================
       COVER
    ========================= */

    const coverPage =
        document.querySelector(
            ".scrapbook-page"
        );


    if (coverPage) {

        const note =
            coverPage.querySelector(
                ".tiny-note"
            );

        const title =
            coverPage.querySelector("h1");

        const message =
            coverPage.querySelector(
                ".message"
            );


        if (note) {
            note.textContent =
                data.coverNote || "";
        }


        if (title) {

            title.innerHTML = "";

            title.append(
                document.createTextNode(
                    data.coverTitle1 || ""
                )
            );


            title.append(
                document.createElement("br")
            );


            const secondLine =
                document.createElement("span");

            secondLine.textContent =
                data.coverTitle2 || "";


            title.append(secondLine);
        }


        if (message) {
            message.textContent =
                data.coverMessage || "";
        }
    }



    /* =========================
       THE BEGINNING
    ========================= */

    const pages =
        document.querySelectorAll(
            ".scrapbook-page"
        );


    const beginningPage =
        pages[2];


    if (beginningPage) {

        const cards =
            beginningPage.querySelectorAll(
                ".memory-card"
            );


        if (cards[0]) {

            const title =
                cards[0].querySelector("h3");

            const text =
                cards[0].querySelector(
                    "p:not(.memory-date)"
                );


            if (title) {
                title.textContent =
                    data.beginningTitle || "";
            }


            if (text) {
                text.textContent =
                    data.beginningText || "";
            }
        }


        if (cards[1]) {

            const title =
                cards[1].querySelector("h3");

            const text =
                cards[1].querySelector(
                    "p:not(.memory-date)"
                );


            if (title) {
                title.textContent =
                    data.beginningTitle2 || "";
            }


            if (text) {
                text.textContent =
                    data.beginningText2 || "";
            }
        }
    }

/* =========================
   THINGS I LOVE ABOUT YOU
========================= */

const loveNote =
    document.getElementById("love-note");

const loveTitle =
    document.getElementById("love-title");

const loveTitle1 =
    document.getElementById("love-title-1");

const loveText1 =
    document.getElementById("love-text-1");

const loveTitle2 =
    document.getElementById("love-title-2");

const loveText2 =
    document.getElementById("love-text-2");

const loveTitle3 =
    document.getElementById("love-title-3");

const loveText3 =
    document.getElementById("love-text-3");


if (loveNote) {

    loveNote.textContent =
        data.loveNote || "";

}

if (loveTitle) {

    loveTitle.textContent =
        data.loveTitle || "";

}

if (loveTitle1) {

    loveTitle1.textContent =
        data.loveTitle1 || "";

}

if (loveText1) {

    loveText1.textContent =
        data.loveText1 || "";

}

if (loveTitle2) {

    loveTitle2.textContent =
        data.loveTitle2 || "";

}

if (loveText2) {

    loveText2.textContent =
        data.loveText2 || "";

}

if (loveTitle3) {

    loveTitle3.textContent =
        data.loveTitle3 || "";

}

if (loveText3) {

    loveText3.textContent =
        data.loveText3 || "";

}

    /* =========================
       PHOTO CAPTIONS
    ========================= */

    const photoCards =
        document.querySelectorAll(
            ".photo-card"
        );


    photoCards.forEach(
        (card, index) => {

            const caption =
                card.querySelector("p");


            if (
                caption &&
                data.captions &&
                data.captions[index] !== undefined
            ) {

                caption.textContent =
                    data.captions[index];
            }
        }
    );



    

    /* =========================
       LETTER
    ========================= */

    const letter =
        document.querySelector(
            ".letter"
        );


    if (
        letter &&
        data.letterText
    ) {

        letter.textContent =
            data.letterText;

        letter.style.whiteSpace =
            "pre-line";
    }


    console.log(
        "✓ Scrapbook data loaded."
    );
}


/* =====================================================
   START
===================================================== */

applyScrapbookData();


/* =====================================================
   LOAD PHOTO 1
===================================================== */

const savedPhoto1 =
    localStorage.getItem("birthdayPhoto1");

const photoDisplay1 =
    document.getElementById("photo-display-1");

if (savedPhoto1 && photoDisplay1) {

    photoDisplay1.innerHTML = `
        <img
            src="${savedPhoto1}"
            alt="Our memory"
        >
    `;

}


const savedPhoto2 = localStorage.getItem("birthdayPhoto2");

const photoDisplay2 =
    document.getElementById("photo-display-2");

if (savedPhoto2 && photoDisplay2) {

    photoDisplay2.innerHTML = `
        <img
            src="${savedPhoto2}"
            alt="Our memory"
        >
    `;

}


/* =====================================================
   PHOTO 3 - 10 DISPLAY
   Using IndexedDB
===================================================== */

for (let i = 3; i <= 10; i++) {

    const photoDisplay =
        document.getElementById(
            `photo-display-${i}`
        );

    if (!photoDisplay) {
        continue;
    }

    getMedia(`birthdayPhoto${i}`)
        .then(file => {

            if (!file) {
                return;
            }

            const imageURL =
                URL.createObjectURL(file);

            photoDisplay.innerHTML = `
                <img
                    src="${imageURL}"
                    alt="Our memory"
                >
            `;

        })
        .catch(error => {

            console.error(
                `Could not load Photo ${i}:`,
                error
            );

        });

}


/* =====================================================
   VIDEO 1 DISPLAY
   Using IndexedDB
===================================================== */

const videoPreview =
    document.getElementById("video-preview");

if (videoPreview) {

    getMedia("birthdayVideo1")
        .then(file => {

            if (!file) {
                return;
            }

            const videoURL =
                URL.createObjectURL(file);

            videoPreview.src =
                videoURL;

            videoPreview.load();

        })
        .catch(error => {

            console.error(
                "Could not load Video 1:",
                error
            );

        });

}


/* =====================================================
   SPOTIFY PLAYERS — 3 SONGS
===================================================== */

const savedScrapbookData =
    localStorage.getItem("birthdayScrapbookData");

if (savedScrapbookData) {

    try {

        const data =
            JSON.parse(savedScrapbookData);

        const spotifyLinks =
            data.spotifyLinks || [];

        for (let i = 0; i < 3; i++) {

            const player =
                document.getElementById(
                    `spotify-player-${i + 1}`
                );

            const link =
                spotifyLinks[i];

            if (!player || !link) {
                continue;
            }

            if (!link.includes("open.spotify.com/")) {
                continue;
            }

            let spotifyURL = link;

            spotifyURL =
                spotifyURL.replace(
                    "open.spotify.com/",
                    "open.spotify.com/embed/"
                );

            /* Remove query parameters */
            spotifyURL =
                spotifyURL.split("?")[0];

            player.innerHTML = `
                <iframe
                    src="${spotifyURL}"
                    width="100%"
                    height="152"
                    frameborder="0"
                    allowtransparency="true"
                    allow="
                        autoplay;
                        clipboard-write;
                        encrypted-media;
                        fullscreen;
                        picture-in-picture
                    "
                    loading="lazy"
                ></iframe>
            `;

        }

    } catch (error) {

        console.error(
            "Could not load Spotify players:",
            error
        );

    }

}

/* =====================================================
   OPEN WHEN LETTERS
===================================================== */

const openWhenButtons =
    document.querySelectorAll(".open-when-button");

openWhenButtons.forEach(button => {

    button.addEventListener("click", function () {

        const letterType =
            this.dataset.letter;

        const message =
            document.getElementById(
                `letter-${letterType}`
            );

        if (!message) {
            return;
        }

        message.classList.toggle("open");

        this.classList.toggle("opened");

    });

});


/* =====================================================
   RESTART SCRAPBOOK
===================================================== */

const restartButton =
    document.getElementById("restart-scrapbook");

if (restartButton) {

    restartButton.addEventListener(
        "click",
        () => {

            turnToPage(0, "back");

        }
    );

}


/* =====================================================
   COVER PHOTO DISPLAY
===================================================== */

const savedCoverPhoto =
    localStorage.getItem("birthdayCoverPhoto");

const coverPhotoDisplay =
    document.getElementById("cover-photo-display");

if (savedCoverPhoto && coverPhotoDisplay) {

    coverPhotoDisplay.innerHTML = `
        <img
            src="${savedCoverPhoto}"
            alt="Our cover memory"
        >
    `;

}


/* =========================================
   INTRO SCREEN
========================================= */

const introScreen = document.getElementById("intro-screen");
const startScrapbook = document.getElementById("start-scrapbook");

if (introScreen && startScrapbook) {

    startScrapbook.addEventListener("click", () => {

        introScreen.classList.add("hide-intro");

        // Allow the scrapbook to become visible underneath
        setTimeout(() => {
            introScreen.style.display = "none";
        }, 1300);

    });

}
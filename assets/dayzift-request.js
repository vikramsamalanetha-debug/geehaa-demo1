/* GeeHaw Diesel & Equipment Repair: service requests from this website go straight into DayZift,
   where they show up under Jobs → Service requests and alert the owner by email and phone.
   A product of LIT America (www.litamerica.net). */
(function(){
  var BUSINESS_ID = "geehaw-diesel-equipment-repair";
  var PHONE = "731-225-9722";
  var form = document.getElementById("wo"); if (!form) return;
  var msg = document.getElementById("f-msg"), send = document.getElementById("f-send");
  var svc = document.getElementById("f-svc"), now = document.getElementById("f-now");
  var db = null, auth = null;
  try {
    var app = firebase.initializeApp({
      apiKey: "AIzaSyDYko5NB-FkjcBpc3fre-3oVbhiF6KKdiw",
      authDomain: "stanfill-clean-pros.firebaseapp.com",
      projectId: "stanfill-clean-pros",
      storageBucket: "stanfill-clean-pros.firebasestorage.app",
      messagingSenderId: "711004999611",
      appId: "1:711004999611:web:061f428e7d8e679e43be9e"
    }, "dayzift");
    auth = app.auth(); db = app.firestore();
  } catch (e) { console.warn(e); }
  // A breakdown or tire change is usually "right now"; scheduled work usually isn't.
  svc.addEventListener("change", function(){ now.checked = svc.selectedOptions[0].hasAttribute("data-now"); });
  function show(text, ok){ msg.textContent = text; msg.className = "msg" + (ok ? " ok" : ""); msg.hidden = false; }
  form.addEventListener("submit", async function(e){
    e.preventDefault();
    var v = function(id){ return (document.getElementById(id).value || "").trim(); };
    if (v("f-web")) return;   // filled in by a bot, not a person
    var name = v("f-name"), phone = v("f-phone"), email = v("f-email").toLowerCase();
    var unit = v("f-unit"), loc = v("f-loc"), problem = v("f-desc"), service = svc.value, label = svc.selectedOptions[0].textContent;
    if (!name || !phone) return show("Please add your name and phone number so we can call you back.");
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return show("That email doesn't look right. Fix it or leave it empty.");
    if (!db) return show("We couldn't send that online. Please call " + PHONE + ". We answer 24/7.");
    var details = [now.checked ? "BROKEN DOWN NOW" : "", "Needs: " + label, loc ? "Location: " + loc : "", unit ? "Truck: " + unit : "", problem ? "Problem: " + problem : ""].filter(Boolean).join("\n");
    // Today's date as DayZift reads it (noon local, so the date doesn't roll over in UTC at night).
    var today = new Date(); today.setHours(12, 0, 0, 0);
    send.disabled = true; send.textContent = "Sending…";
    try {
      if (!auth.currentUser) await auth.signInAnonymously();
      var req = {
        uid: auth.currentUser.uid, guest: true, source: "website",
        name: name.slice(0, 120), phone: phone.slice(0, 120), service: service,
        requestedDate: today.toISOString(), timeWindow: "", size: "",
        details: details.slice(0, 3000), problem: problem.slice(0, 1500), location: loc.slice(0, 200), unit: unit.slice(0, 100),
        emergency: !!now.checked, wantsRewards: false, status: "pending", businessId: BUSINESS_ID,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      };
      if (email) req.email = email;
      await db.collection("bookings").add(req);
      form.reset(); now.checked = true;
      show(req.emergency
        ? "Got it, " + name.split(" ")[0] + ". Garrick has your request. For the fastest help, also call " + PHONE + "."
        : "Thanks, " + name.split(" ")[0] + ". Your request is in and we'll call you back soon.", true);
    } catch (err) {
      console.warn(err);
      show("We couldn't send that online just now. Please call " + PHONE + ". We answer 24/7.");
    } finally {
      send.disabled = false; send.textContent = "Send request";
    }
  });
})();

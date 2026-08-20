// ============================================================================
//  FAL FIFA TURNIER — script.js
// ============================================================================
//  Diese Datei ist in nummerierte Abschnitte gegliedert. Zum schnellen
//  Springen kannst du im Editor nach "// N." suchen (N = Abschnittsnummer).
//
//  1.   Firebase-Konfiguration      -> Verbindung zur Online-Datenbank
//  2.   Zustand (globale Variablen) -> hier "lebt" der komplette Turnier-Stand
//  3.   Rollen & Auth               -> An-/Abmelden, Rollenauswahl-Modal, Passwörter
//  4.   Live-Sync via Firebase      -> lädt/speichert den Zustand für alle Geräte gleichzeitig
//  5.   Profi-Clubs Verwaltung      -> Liste der Vereine fürs Glücksrad + Wappen
//  6.   Live-Auslosungs-Show        -> das Glücksrad (Teams & Clubs auslosen)
//  7.   Standard Admin Handlungen   -> Spieler hinzufügen/löschen, Test-Spieler, Sperren
//  8.   Gruppen- & KO-Auslosung     -> Gruppenphase + Viertelfinale/Halbfinale/Finale
//  9.   Team- & Match-Updates       -> Ergebnisse eintragen/bestätigen, Spiel starten
//  10.  Render Panel & UI           -> baut die komplette Bildschirm-Anzeige zusammen
//       10a. Home (Regeln, Tippspiel, Dashboard)
//       10b. Tippspiel-Logik
//       10c. Dashboard-Statistiken
//  11.  Wett-System                 -> FAL-Coins, Wetten platzieren & auszahlen
//
//  Das Prinzip: ALLE Nutzer sehen denselben Zustand (players, teams, groups, ...),
//  weil er live über Firebase synchronisiert wird (siehe Abschnitt 4). Ändert
//  jemand etwas, ruft er saveData() auf -> das schreibt den Zustand in die
//  Datenbank -> alle anderen Geräte bekommen automatisch das Update und rendern
//  die Seite neu (renderAll()).
// ============================================================================

// Diese Funktionen werden aus HTML-Buttons per onclick="..." aufgerufen.
// Da script.js als Modul-ähnliche Datei geladen wird, müssen sie hier explizit
// am globalen window-Objekt hängen, sonst findet das HTML sie nicht.
window.showGlobalNewNameInput = showGlobalNewNameInput;
window.showGlobalExistingNames = showGlobalExistingNames;
window.resetGlobalIdentitySelection = resetGlobalIdentitySelection;
window.registerGlobalIdentity = registerGlobalIdentity;
window.selectGlobalExistingName = selectGlobalExistingName;
window.confirmGodPassword = confirmGodPassword;
window.promptIdentityPassword = promptIdentityPassword;
window.confirmIdentityPassword = confirmIdentityPassword;
window.switchUser = switchUser;
window.joinCurrentTournamentAsPlayer = joinCurrentTournamentAsPlayer;
window.spectateCurrentTournament = spectateCurrentTournament;
window.leaveTournament = leaveTournament;
window.showTab = showTab;
window.addPlayer = addPlayer;
window.addTestPlayers = addTestPlayers;
window.removePlayer = removePlayer;
window.toggleRef = toggleRef;
window.setPlayerPassword = setPlayerPassword;
window.removePlayerPassword = removePlayerPassword;
window.requestOwnPassword = requestOwnPassword;
window.confirmPendingPassword = confirmPendingPassword;
window.rejectPendingPassword = rejectPendingPassword;
window.toggleRegistrationLock = toggleRegistrationLock;
window.toggleTournamentMode = toggleTournamentMode;
window.toggleTournamentSport = toggleTournamentSport;
window.updateMatchInterval = updateMatchInterval;
window.resetTournament = resetTournament;
window.resetKOPhase = resetKOPhase;
window.resetGroupPhase = resetGroupPhase;
window.resetTeamDraft = resetTeamDraft;
window.resetBettingSystem = resetBettingSystem;
window.updateTeamName = updateTeamName;
window.submitMatchResult = submitMatchResult;
window.confirmMatchResult = confirmMatchResult;
window.markMatchStarted = markMatchStarted;
window.addClub = addClub;
window.removeClub = removeClub;
window.resetClubsToDefault = resetClubsToDefault;
window.setClubLogo = setClubLogo;
window.triggerClubLogoUpload = triggerClubLogoUpload;
window.handleClubLogoFileSelected = handleClubLogoFileSelected;
window.triggerTeamPhotoUpload = triggerTeamPhotoUpload;
window.handleTeamPhotoFileSelected = handleTeamPhotoFileSelected;
window.setTeamDisplayMode = setTeamDisplayMode;
window.startInteractiveDraft = startInteractiveDraft;
window.addDraftCheat = addDraftCheat;
window.removeDraftCheat = removeDraftCheat;
window.quickDrawTeams = quickDrawTeams;
window.createDartsTeamsFromPlayers = createDartsTeamsFromPlayers;
window.spinWheel = spinWheel;
window.skipWheelSpin = skipWheelSpin;
window.nextDraftStep = nextDraftStep;
window.finishDraft = finishDraft;
window.cancelDraft = cancelDraft;
window.startGroupDraft = startGroupDraft;
window.quickDrawGroups = quickDrawGroups;
window.spinGroupWheel = spinGroupWheel;
window.skipGroupWheelSpin = skipGroupWheelSpin;
window.cancelGroupDraft = cancelGroupDraft;
window.finishGroupDraft = finishGroupDraft;
window.advanceKORound = advanceKORound;
window.saveRules = saveRules;
window.submitTip = submitTip;
window.placeBet = placeBet;
window.openWrapped = openWrapped;
window.closeWrapped = closeWrapped;
window.setCoinAnimation = setCoinAnimation;
window.toggleHeaderDetails = toggleHeaderDetails;
window.enterTournament = enterTournament;
window.openFormatWizard = openFormatWizard;
window.closeFormatWizard = closeFormatWizard;
window.analyzeFormatWizardText = analyzeFormatWizardText;
window.renderFormatWizardStep1 = renderFormatWizardStep1;
window.confirmFormatWizardPreview = confirmFormatWizardPreview;
window.startCreateTournament = startCreateTournament;
window.cancelCreateTournament = cancelCreateTournament;
window.confirmCreateTournament = confirmCreateTournament;
window.skipTournamentJoinPassword = skipTournamentJoinPassword;
window.confirmTournamentJoinPassword = confirmTournamentJoinPassword;
window.confirmJoinPasswordAndJoin = confirmJoinPasswordAndJoin;
window.setTournamentJoinPassword = setTournamentJoinPassword;
window.clearTournamentJoinPassword = clearTournamentJoinPassword;
window.goToLandingPage = goToLandingPage;
window.deleteTournamentAsGod = deleteTournamentAsGod;
window.renameTournamentAsGod = renameTournamentAsGod;
window.toggleGlobalLock = toggleGlobalLock;
window.openGodPanel = openGodPanel;
window.closeGodPanel = closeGodPanel;
window.deleteGlobalPlayerAsGod = deleteGlobalPlayerAsGod;
window.openProfile = openProfile;
window.closeProfile = closeProfile;
window.renderProfilePlayerList = renderProfilePlayerList;
window.triggerProfilePicUpload = triggerProfilePicUpload;
window.handleProfilePicFileSelected = handleProfilePicFileSelected;
window.saveProfileBio = saveProfileBio;
window.sendFriendRequest = sendFriendRequest;
window.acceptFriendRequest = acceptFriendRequest;
window.declineFriendRequest = declineFriendRequest;
window.removeFriend = removeFriend;
window.acceptInvite = acceptInvite;
window.dismissInvite = dismissInvite;
window.inviteToTournament = inviteToTournament;
window.openLeaderboard = openLeaderboard;
window.closeLeaderboard = closeLeaderboard;
// ============================================================================
// 1. FIREBASE-KONFIGURATION — Verbindungsdaten zur Online-Datenbank
// ============================================================================
const firebaseConfig = {
  apiKey: "AIzaSyCWYRh1GonZYsOqxGXn1nWoUMWl7gamGoA",
  authDomain: "website-test-3800e.firebaseapp.com",
  databaseURL: "https://website-test-3800e-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "website-test-3800e",
  storageBucket: "website-test-3800e.firebasestorage.app",
  messagingSenderId: "605126180642",
  appId: "1:605126180642:web:be0d85d1549f59617aaf7b",
  measurementId: "G-9FHBBGE8F2"
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();
// Das "God-Passwort" gilt website-weit für den Namen "tim" (siehe isGod()) - komplett
// unabhängig von den einzelnen, pro Turnier selbst gewählten Admin-Passwörtern.
const GOD_PASSWORD = "1234";
const DEFAULT_CLUBS = [
  "Real Madrid", "FC Bayern", "ManCity", "Arsenal",
  "FC Barcelona", "PSG", "Inter Mailand", "Leverkusen",
  "Liverpool", "ManU", "Atletico", "BVB"
];
const DEFAULT_RULES = "Noch keine Regeln festgelegt. Der Admin kann sie hier eintragen.";
// Feste 18er-Farbpalette fürs Glücksrad (Spieler & unbekannte Clubs)
const COLOR_PALETTE_18 = [
  '#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6', '#1abc9c',
  '#e67e22', '#ff6b81', '#00cec9', '#fd79a8', '#6c5ce7', '#00b894',
  '#0984e3', '#d63031', '#55efc4', '#a29bfe', '#fab1a0', '#74b9ff'
];
// Bekannte Vereinsfarben für die Standard-Topteams
const KNOWN_CLUB_COLORS = {
  "Real Madrid": "#FEBE10",
  "FC Bayern": "#DC052D",
  "ManCity": "#6CABDD",
  "Arsenal": "#EF0107",
  "FC Barcelona": "#A50044",
  "PSG": "#004170",
  "Inter Mailand": "#0068A8",
  "Leverkusen": "#E32221",
  "Liverpool": "#C8102E",
  "ManU": "#DA291C",
  "Atletico": "#CE3524",
  "BVB": "#FDE100"
};
// Standard-Wappen für die 12 Standard-Topteams (Wikipedia/Wikimedia Commons).
// Damit muss der Admin die Wappen-URLs nicht mehr von Hand heraussuchen und
// eintragen (siehe setClubLogo) - für diese Vereine sind sie schon hinterlegt.
// Fügt der Admin einen eigenen Club hinzu, muss er dafür weiterhin selbst eine
// Wappen-URL eintragen, da wir dafür keine feste Quelle kennen.
const DEFAULT_CLUB_LOGOS = {
  "Real Madrid": "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg",
  "FC Bayern": "https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg",
  "ManCity": "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg",
  "Arsenal": "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg",
  "FC Barcelona": "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg",
  "PSG": "https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg",
  "Inter Mailand": "https://upload.wikimedia.org/wikipedia/commons/0/05/FC_Internazionale_Milano_2021.svg",
  "Leverkusen": "https://upload.wikimedia.org/wikipedia/en/5/59/Bayer_04_Leverkusen_logo.svg",
  "Liverpool": "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg",
  "ManU": "https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg",
  "Atletico": "https://upload.wikimedia.org/wikipedia/en/f/f9/Atletico_Madrid_Logo_2024.svg",
  "BVB": "https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg"
};
// ============================================================================
// 2. ZUSTAND — globale Variablen, die den kompletten Turnier-Stand abbilden.
//    Diese Werte werden über Firebase mit allen Geräten synchronisiert (Abschnitt 4).
// ============================================================================
let players = [];
let availableClubs = [...DEFAULT_CLUBS];
let clubLogos = { ...DEFAULT_CLUB_LOGOS };     // { clubName: "https://...wappen.png" }
let teams = [];
// 'duo' (Standard, 2 Spieler pro Team teilen sich einen Club) oder 'solo' (jeder Spieler
// bekommt seinen EIGENEN Club, kein Partner) - wird beim Turniererstellen festgelegt (siehe
// parseTournamentFormatText/openFormatWizard), vor der Auslosung im Admin-Panel noch änderbar.
let tournamentMode = 'duo';
// 'fifa' (Standard, mit Vereinen/Clubs) oder 'darts' (kein Verein, jeder Spieler ist direkt
// sein eigenes "Team" - siehe createDartsTeamsFromPlayers). Läuft technisch als tournamentMode
// 'solo' weiter (1 Spieler pro Team, kein Partner), nur eben zusätzlich OHNE Verein.
let tournamentSport = 'fifa';
let plannedPlayerCount = null; // rein informative Ziel-Spieleranzahl aus der Freitext-Beschreibung, siehe openFormatWizard()
let numGroups = 3;       // Wie viele Gruppen wurden zuletzt ausgelost? (beliebige Zahl ab 2, siehe generateGroupLetters)
// Wie viele Teams insgesamt in die KO-Runde einziehen (admin-/text-wählbar, siehe advanceKORound).
// null = noch nicht festgelegt -> beim ersten KO-Auslosen wird ein Standardwert (2 pro Gruppe)
// vorgeschlagen. Reicht die Zahl nicht glatt durch alle Gruppen, füllt ein automatischer
// Quervergleich (Gruppendritte, ggf. -vierte, ...) den Rest auf, siehe computeKOQualifiers().
let koQualifiersTotal = null;
// Teams mit Freilos direkt in Runde 2, wenn die KO-Teilnehmerzahl keine Zweierpotenz ist
// (siehe buildKORound1Pairing) - wird nach der ersten KO-Runde wieder geleert.
let koByeTeamIds = [];
let matchIntervalMinutes = 20; // Zeitabstand zwischen zwei Spiel-Slots (Hauptplatz+Nebenplatz), admin-einstellbar
// Admin-"Cheat"-Vorauswahl fürs Glücksrad: [{ p1, p2, club }]. Legt fest, welche
// zwei Spieler garantiert ins selbe Team kommen (und optional welchen Club sie
// bekommen) - der Rest bleibt komplett echt zufällig. Siehe spinWheel().
let draftCheats = [];
let groups = [];
let groupMatches = [];
let koMatches = [];
let rules = DEFAULT_RULES;
let tips = {};          // { playerName: { teamId, amount } }
let tipsEvaluated = false;
let registrationLocked = false;
// Optionales Beitritts-Passwort NUR für dieses Turnier (unabhängig vom Admin-Passwort des
// Erstellers!) - wer als NEUER Spieler beitreten will, muss es kennen. null = kein Schutz,
// jeder darf frei beitreten. Wird direkt bei der Turniererstellung abgefragt (optional),
// siehe confirmCreateTournament/finalizeCreateTournament + joinCurrentTournamentAsPlayer.
let joinPassword = null;
// Wie sich das FAL-Coin-Symbol in der Übersicht verhält: 'none' (still), 'spin' (dreht sich),
// 'bounce' (wippt), 'pulse' (pulsiert), 'party' (dreht+hüpft+leuchtet) oder 'fireworks'
// (Glitzer-Explosion) - admin-einstellbar, siehe setCoinAnimation().
let coinAnimation = 'none';
// Welches Turnier ist gerade aktiv? Jedes Turnier wird komplett getrennt in Firebase
// unter tournaments/{currentTournamentId} gespeichert (siehe Abschnitt "Turnier-Auswahl").
let currentTournamentId = localStorage.getItem('fifa_current_tournament') || null;
let tournamentsList = {}; // { id: { name, createdAt, createdBy } } - für die Turnierauswahl-Startseite
let tournamentRef = null; // aktuell aktiver Firebase-Listener-Pfad, zum sauberen Wechseln
// Die eigene Identität ist jetzt GLOBAL (website-weit dieselbe, nicht mehr pro Turnier) -
// wird VOR der Turnierauswahl festgelegt, siehe Abschnitt 3b (Globale Identität).
let myPlayerName = localStorage.getItem('fifa_global_name') || null;
let pendingGlobalLogin = null; // { name } - während der God-Passwort- ODER der persönlichen Passwort-Abfrage im globalen Identitäts-Modal
let pendingNewTournament = null; // { name, newOwnerPassword } - zwischen Admin-Passwort- und Beitritts-Passwort-Schritt der Turniererstellung
let globalPlayers = {}; // { nameLowerCase: { name, createdAt, password, passwordVersion, pendingPassword, bio, profilePic, friends, friendRequests, invites } } - Registry aller bekannten Identitäten. Das Passwort gilt (anders als früher) identitätsweit für ALLE Turniere, nicht mehr pro Turnier einzeln.
let profileViewKey = null; // welcher Spieler wird gerade im Profil-Screen angezeigt (null = das eigene Profil), siehe openProfile()
let globalSettings = { lockNewIdentities: false, lockNewTournaments: false }; // website-weite God-Sperren
let godOversightData = {}; // { tournamentId: { name, players: [...] } } - nur für God geladen, siehe attachGodOversightListener
let godOversightRef = null;
let tournamentEntryHandled = false; // verhindert, dass handleTournamentEntry() bei jedem Live-Update erneut den Beitreten/Zuschauen-Dialog zeigt
let myPlayerWasPresent = false; // war man beim letzten Laden Spieler in DIESEM Turnier? (erkennt ein "aus dem Turnier entfernt"-Event, siehe attachTournamentListener)
let isFirebaseConnected = null; // null = noch unbekannt, true/false = Verbindungsstatus (siehe .info/connected weiter unten)
let userBalances = {};  // { "Name": 100 }
let bets = [];          // { matchId, isKO, playerName, chosenTeamId, amount }
// Status-Variablen für das Auslosungs-System (Duo-Draft) - UNVERÄNDERT
let draftState = { active: false, currentStep: 0, tempP1: null, tempP2: null, remainingPlayers: [], remainingClubs: [], spinning: false, startTime: null, targetAngle: 0, duration: 4000, lastDrawnItem: null, pairs: [], pendingTarget: null };
let animFrameId = null;
let draftSpinTimeoutId = null; // laufender setTimeout-Handle der aktuellen Dreh-Animation, siehe spinWheel()/skipWheelSpin()
// Eigene, EINFACHERE Draft-State-Machine fürs Gruppen-Glücksrad (welches Team kommt in
// welche Gruppe) - bewusst getrennt von draftState (Team-Auslosung), weil hier nur ein
// einziger Ziehungs-Schritt existiert (kein Cheat-System, kein Duo/Solo-Unterschied). Teilt
// sich aber dasselbe #draft-modal/#draft-stage-Overlay, siehe handleLiveDraftUI().
let groupDraftState = { active: false, spinning: false, remainingTeams: [], groupLetters: [], targetGroupIndex: 0, assignments: {}, lastDrawnItem: null, lastAssignedGroup: null, startTime: null, targetAngle: 0, duration: 4000, pendingTarget: null };
let groupSpinTimeoutId = null;
// localStorage-Schlüssel, um sich zu merken, mit welcher Passwort-Version man zuletzt ALS
// DIESE IDENTITÄT erfolgreich angemeldet war. Das Passwort gilt jetzt identitätsweit (für
// ALLE Turniere gemeinsam) statt pro Turnier - deshalb NUR nach dem Namen geschlüsselt,
// nicht mehr zusätzlich nach Turnier-ID.
function myIdentityPwvStorageKey(name) {
  return 'fifa_identity_pwv_' + (name ? name.trim().toLowerCase() : 'none');
}
// Sucht das Spieler-Objekt zu einem Namen (Groß-/Kleinschreibung egal)
function getPlayerObj(name) {
  if (!name) return null;
  return players.find(p => p.name.toLowerCase() === name.trim().toLowerCase());
}
// Liefert den globalen Registry-Eintrag (inkl. Passwort) zu einem Namen
function getGlobalPlayer(name) {
  if (!name) return null;
  return globalPlayers[name.trim().toLowerCase()] || null;
}
// Merkt sich lokal, mit welcher "Passwort-Version" die aktuelle Identität zuletzt erfolgreich
// angemeldet wurde. Setzt der God später ein neues/anderes Passwort (siehe setPlayerPassword/
// confirmPendingPassword), stimmt die Version nicht mehr überein -> beim nächsten Anmelden mit
// dieser Identität wird erneut nach dem (dann neuen) Passwort gefragt.
function markIdentityPasswordVersion(name) {
  const gp = getGlobalPlayer(name);
  localStorage.setItem(myIdentityPwvStorageKey(name), String(gp && gp.passwordVersion ? gp.passwordVersion : 0));
}
// true, wenn die aktuelle Identität "Tim" ist UND das God-Passwort bestätigt wurde (siehe
// confirmGodPassword). Der "God" hat website-weite Sonderrechte: God-Panel, Cheats fürs
// Glücksrad, sowie automatisch Admin-Rechte in JEDEM Turnier (auch ohne dort Mitspieler zu sein).
function isGod() {
  return !!(myPlayerName && myPlayerName.trim().toLowerCase() === 'tim');
}
// true, wenn der aktuell angemeldete Spieler DIESES Turnier erstellt hat (siehe confirmCreateTournament)
function isTournamentOwner() {
  const p = getPlayerObj(myPlayerName);
  return !!(p && p.isTournamentOwner);
}
// "Admin" ist jetzt entweder der God (Tim, website-weit) ODER der Ersteller/Admin DIESES
// einen Turniers - beide dürfen alles im Admin-Panel AUSSER den Auslosungs-Cheats (die
// bleiben exklusiv dem God vorbehalten, siehe addDraftCheat/renderDraftCheatPanel).
function isAdmin() {
  return isGod() || isTournamentOwner();
}
// true, wenn der aktuell angemeldete Spieler die Schiedsrichter-Rolle (Ref) hat
function isRef() {
  const p = getPlayerObj(myPlayerName);
  return !!(p && p.isRef);
}
// Ref hat exakt die gleichen Rechte wie Admin, AUSSER: Spieler löschen & Ref-Rolle selbst vergeben/entziehen.
function hasElevated() {
  return isAdmin() || isRef();
}
// Alias, damit alte Bezeichnung weiterhin funktioniert
function canManageMatches() {
  return hasElevated();
}
// Liefert das Team, in dem der aktuell angemeldete Spieler selbst mitspielt
function getMyTeam() {
  if (!myPlayerName) return null;
  return teams.find(t => t.p1 === myPlayerName || t.p2 === myPlayerName);
}
// true, sobald das Finale gespielt UND vom Admin/Ref bestätigt wurde
function isTournamentFinished() {
  const finale = koMatches.find(m => m.round === '🏆 FINALE');
  return !!(finale && finale.confirmed);
}
// true, sobald irgendein Spiel (Gruppe oder KO) gestartet oder bereits gespielt wurde.
// Wird genutzt, um den Turniersieger-Tipp zu sperren, sobald das Turnier "live" ist.
function hasTournamentStarted() {
  return [...groupMatches, ...koMatches].some(m => m.started || m.played);
}
// Gibt ein kleines <img>-Wappen zurück, falls für den Club eine Logo-URL hinterlegt ist
function clubLogoImg(clubName, size) {
  size = size || 18;
  if (!clubName || !clubLogos[clubName]) return '';
  return `<img src="${clubLogos[clubName]}" alt="${clubName}" style="height:${size}px; width:${size}px; object-fit:contain; vertical-align:middle; border-radius:3px; margin-right:5px; background:#fff;">`;
}
// Macht einen Text HTML-sicher (verhindert, dass z.B. ein Spieler- oder Club-Name als Code interpretiert wird)
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
// Liefert die hinterlegte Wappen-Bild-URL eines Clubs, falls vorhanden (sonst leerer String)
function getClubLogoUrl(clubName) {
  return (clubName && clubLogos[clubName]) ? clubLogos[clubName] : '';
}
// Liefert die Bild-URL, die für ein Team angezeigt werden soll: entweder das eigene,
// von den Spielern hochgeladene Team-Foto (falls vorhanden UND ausgewählt), sonst das
// Wappen des zugelosten Vereins. Siehe triggerTeamPhotoUpload/setTeamDisplayMode.
function getTeamDisplayImageUrl(team) {
  if (!team) return '';
  if (team.displayMode === 'photo' && team.photo) return team.photo;
  return getClubLogoUrl(team.club);
}
// Kleines Icon-<img> für ein Team - zeigt Foto (rund) oder Vereinswappen (eckig),
// je nachdem was gerade für dieses Team eingestellt ist.
function teamCrestImg(team, size) {
  size = size || 18;
  if (!team) return '';
  const usingPhoto = team.displayMode === 'photo' && !!team.photo;
  const url = usingPhoto ? team.photo : getClubLogoUrl(team.club);
  if (!url) return '';
  const fit = usingPhoto ? 'cover' : 'contain';
  const radius = usingPhoto ? '50%' : '3px';
  return `<img src="${url}" alt="" style="height:${size}px; width:${size}px; object-fit:${fit}; vertical-align:middle; border-radius:${radius}; margin-right:5px; background:#fff;">`;
}
// Baut das FAL-Coin-Symbol (reines CSS, kein Bild nötig - siehe .fal-coin in style.css).
// Bewegt sich je nach admin-eingestellter coinAnimation (still/spin/bounce/pulse), siehe
// setCoinAnimation() im Wett-System-Abschnitt weiter unten.
function coinIcon(size) {
  size = size || 20;
  const animClass = (coinAnimation && coinAnimation !== 'none') ? ' fal-coin-anim-' + coinAnimation : '';
  return `<span class="fal-coin${animClass}" style="width:${size}px; height:${size}px;"></span>`;
}
// Liefert eine feste Farbe für einen Club: bekannte Vereinsfarbe, sonst eine
// aus der 18er-Palette abgeleitete Farbe, die für den gleichen Namen immer gleich bleibt.
function getClubColor(clubName) {
  if (!clubName) return null;
  if (KNOWN_CLUB_COLORS[clubName]) return KNOWN_CLUB_COLORS[clubName];
  let hash = 0;
  for (let i = 0; i < clubName.length; i++) hash = (hash * 31 + clubName.charCodeAt(i)) >>> 0;
  return COLOR_PALETTE_18[hash % COLOR_PALETTE_18.length];
}
// Bestimmt eine gut lesbare Textfarbe (hell oder dunkel) für einen Hintergrund,
// je nachdem wie hell dieser Hintergrund ist. Wird fürs Glücksrad gebraucht, damit
// z.B. dunkelblauer Text auf Gelb nicht durch eine dicke Kontur "zuverschmiert" wird
// und heller Text auf hellen Vereinsfarben (z.B. hellblaues ManCity) lesbar bleibt.
function getReadableTextColor(bgColorHex) {
  if (!bgColorHex || bgColorHex[0] !== '#') return '#ffffff';
  const hex = bgColorHex.slice(1);
  const full = hex.length === 3 ? hex.split('').map(c => c + c).join('') : hex;
  const r = parseInt(full.substring(0, 2), 16);
  const g = parseInt(full.substring(2, 4), 16);
  const b = parseInt(full.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? '#12202e' : '#ffffff';
}
// Bild-Cache fürs Glücksrad: lädt jedes Vereinswappen nur einmal und zeichnet
// das Rad neu, sobald ein Bild fertig geladen ist (damit es sofort sichtbar wird).
const clubLogoImageCache = {};
function getClubLogoImageElement(clubName) {
  const url = getClubLogoUrl(clubName);
  if (!url) return null;
  if (clubLogoImageCache[url]) return clubLogoImageCache[url];
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    if (draftState && draftState.active) drawWheelCanvas(draftState.targetAngle || 0);
  };
  img.src = url;
  clubLogoImageCache[url] = img;
  return img;
}
// Fragt per Prompt eine neue Wappen-Bild-URL für einen Club ab und speichert sie
function setClubLogo(clubName) {
  if (!hasElevated()) return;
  const current = clubLogos[clubName] || '';
  const url = prompt(`Wappen-Bild-URL für ${clubName} eingeben (leer lassen zum Entfernen):`, current);
  if (url === null) return;
  if (url.trim() === '') {
    delete clubLogos[clubName];
  } else {
    clubLogos[clubName] = url.trim();
  }
  saveData();
}
// Merkt sich, für welchen Club gerade ein Foto hochgeladen wird (zwischen dem Öffnen
// der Dateiauswahl und der Auswahl der Datei liegt ja ein Moment Wartezeit)
let pendingLogoUploadClub = null;
// Öffnet die Datei-/Kameraauswahl des Handys/Browsers für ein bestimmtes Wappen
function triggerClubLogoUpload(clubName) {
  if (!hasElevated()) return;
  pendingLogoUploadClub = clubName;
  const input = document.getElementById('club-logo-file-input');
  if (input) input.click();
}
// Wird aufgerufen, sobald im Datei-Dialog ein Bild ausgewählt/fotografiert wurde
function handleClubLogoFileSelected(event) {
  const file = event.target.files && event.target.files[0];
  event.target.value = ''; // zurücksetzen, damit dieselbe Datei auch erneut ausgewählt werden kann
  const clubName = pendingLogoUploadClub;
  pendingLogoUploadClub = null;
  if (!file || !clubName) return;
  if (!file.type.startsWith('image/')) return alert('Bitte eine Bilddatei auswählen!');
  resizeImageFile(file, 200, (dataUrl) => {
    clubLogos[clubName] = dataUrl;
    saveData();
    renderAll();
  });
}
// Verkleinert ein hochgeladenes Bild (z.B. ein Handyfoto) per Canvas auf maximal
// maxSize Pixel an der längeren Seite, damit auch Fotos nicht die Datenbank aufblähen.
// Ruft callback(dataUrl) mit dem fertigen, verkleinerten Bild als data:-URL auf.
function resizeImageFile(file, maxSize, callback) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      let width = img.width, height = img.height;
      if (width > height && width > maxSize) {
        height = Math.round(height * maxSize / width);
        width = maxSize;
      } else if (height >= width && height > maxSize) {
        width = Math.round(width * maxSize / height);
        height = maxSize;
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      callback(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}
// Merkt sich, für welches Team gerade ein eigenes Foto hochgeladen wird
let pendingTeamPhotoUploadId = null;
// Prüft, ob jemand ein Team-Foto hochladen/die Anzeige umschalten darf: die beiden
// Team-Mitglieder selbst, oder Admin/Ref
function canEditTeamPhoto(team) {
  if (!team) return false;
  const isMyTeam = !!(myPlayerName && (team.p1 === myPlayerName || team.p2 === myPlayerName));
  return isMyTeam || hasElevated();
}
// Öffnet die Datei-/Kameraauswahl fürs eigene Team-Foto
function triggerTeamPhotoUpload(teamId) {
  const team = teams.find(t => t.id === teamId);
  if (!canEditTeamPhoto(team)) return;
  pendingTeamPhotoUploadId = teamId;
  const input = document.getElementById('team-photo-file-input');
  if (input) input.click();
}
// Wird aufgerufen, sobald im Datei-Dialog ein Team-Foto ausgewählt/fotografiert wurde
function handleTeamPhotoFileSelected(event) {
  const file = event.target.files && event.target.files[0];
  event.target.value = '';
  const teamId = pendingTeamPhotoUploadId;
  pendingTeamPhotoUploadId = null;
  if (!file || teamId === null) return;
  const team = teams.find(t => t.id === teamId);
  if (!canEditTeamPhoto(team)) return;
  if (!file.type.startsWith('image/')) return alert('Bitte eine Bilddatei auswählen!');
  resizeImageFile(file, 300, (dataUrl) => {
    team.photo = dataUrl;
    team.displayMode = 'photo'; // nach dem Hochladen direkt aufs neue Foto umstellen
    saveData();
    renderAll();
  });
}
// Wechselt für ein Team zwischen Vereinswappen und eigenem Foto (nur Team-Mitglieder/Admin/Ref)
function setTeamDisplayMode(teamId, mode) {
  const team = teams.find(t => t.id === teamId);
  if (!canEditTeamPhoto(team)) return;
  team.displayMode = mode;
  saveData();
  renderAll();
}
document.addEventListener('DOMContentLoaded', () => {
  // Turnierliste + website-weite Identitäts-Registry/Sperren laufen immer mit
  attachTournamentsMetaListener();
  attachGlobalPlayersListener();
  attachGlobalSettingsListener();
  migrateOldTournamentIfNeeded().then((migratedId) => {
    if (migratedId) {
      currentTournamentId = migratedId;
      localStorage.setItem('fifa_current_tournament', migratedId);
    }
    if (myPlayerName) {
      proceedAfterGlobalIdentity();
    } else {
      document.getElementById('global-identity-modal').style.display = 'flex';
    }
  });
});
// Die Selbstheilung der Glücksräder (siehe renderDraftStep()/renderGroupDraftStep()) greift
// nur, wenn IRGENDWANN erneut gerendert wird - normalerweise der lokale setTimeout nach der
// ~4s-Animation. Sperrt sich aber z.B. das Handy-Display mitten in der Animation oder wechselt
// man kurz die App, pausiert/verwirft der Browser diesen Timer OHNE dass danach von selbst noch
// ein Render passiert (Firebase feuert ja nur bei echten Datenänderungen) - das Rad bliebe dann
// für immer beim zuletzt gezogenen Team hängen. Deshalb zusätzlich: bei jeder Rückkehr in den
// Tab UND als Sicherheitsnetz alle 2s (nur wirksam, während wirklich gerade gedreht wird) einen
// Render erzwingen, damit die längst vorhandene Recovery-Logik zuverlässig greift.
function recoverStuckWheelsIfAny() {
  if ((draftState && draftState.active && draftState.spinning) ||
      (groupDraftState && groupDraftState.active && groupDraftState.spinning)) {
    handleLiveDraftUI();
  }
}
document.addEventListener('visibilitychange', () => { if (!document.hidden) recoverStuckWheelsIfAny(); });
window.addEventListener('pageshow', recoverStuckWheelsIfAny);
setInterval(recoverStuckWheelsIfAny, 2000);
// ============================================================================
// 3. ROLLEN & AUTH — Globale Identität (website-weit), Turnier-Beitritt, Passwörter
// ============================================================================
// Läuft, sobald die eigene GLOBALE Identität feststeht (aus localStorage bekannt ODER
// gerade im Identitäts-Modal festgelegt/bestätigt). Geht dann entweder direkt ins zuletzt
// offene Turnier oder zeigt die Turnierauswahl-Startseite.
function proceedAfterGlobalIdentity() {
  document.getElementById('global-identity-modal').style.display = 'none';
  if (isGod()) attachGodOversightListener();
  if (currentTournamentId) {
    tournamentEntryHandled = false;
    attachTournamentListener();
  } else {
    renderLandingPage();
    document.getElementById('landing-page').style.display = 'flex';
  }
}
// Blendet im Identitäts-Modal das Formular "Neue Identität" ein
function showGlobalNewNameInput() {
  // Die Sperre wird erst in registerGlobalIdentity() geprüft (nicht schon hier!) - sonst
  // könnte sich nicht mal der God selbst über "Neue Identität" -> "tim" einloggen, falls
  // gerade neue Identitäten gesperrt sind. Der Name ist an dieser Stelle noch unbekannt.
  document.getElementById('global-role-options').style.display = 'none';
  document.getElementById('global-new-name-select').style.display = 'block';
  document.getElementById('global-existing-select').style.display = 'none';
  document.getElementById('global-god-password-select').style.display = 'none';
  document.getElementById('global-identity-password-select').style.display = 'none';
}
// Blendet im Identitäts-Modal die Liste bereits bekannter Identitäten ein
function showGlobalExistingNames() {
  const container = document.getElementById('global-existing-list');
  if (container) {
    const names = Object.values(globalPlayers).map(p => p.name).sort((a, b) => a.localeCompare(b));
    container.innerHTML = names.length === 0
      ? '<p class="empty-state">Noch keine Identitäten bekannt.</p>'
      : names.map(n => `<button class="btn-secondary" style="margin: 4px; width: auto;" onclick="selectGlobalExistingName('${n.replace(/'/g, "\\'")}')">${escapeHtml(n)}</button>`).join('');
  }
  document.getElementById('global-role-options').style.display = 'none';
  document.getElementById('global-new-name-select').style.display = 'none';
  document.getElementById('global-existing-select').style.display = 'block';
  document.getElementById('global-god-password-select').style.display = 'none';
  document.getElementById('global-identity-password-select').style.display = 'none';
}
// Setzt das Identitäts-Modal auf die Start-Ansicht (die 2 Hauptbuttons) zurück
function resetGlobalIdentitySelection() {
  pendingGlobalLogin = null;
  document.getElementById('global-role-options').style.display = 'block';
  document.getElementById('global-new-name-select').style.display = 'none';
  document.getElementById('global-existing-select').style.display = 'none';
  document.getElementById('global-god-password-select').style.display = 'none';
  document.getElementById('global-identity-password-select').style.display = 'none';
}
// Legt eine komplett neue globale Identität an (fragt bei "tim" zuerst das God-Passwort ab)
function registerGlobalIdentity() {
  const input = document.getElementById('global-self-name');
  const name = input ? input.value.trim() : '';
  if (!name) return alert('Bitte einen Namen eingeben!');
  if (globalPlayers[name.toLowerCase()]) return alert('Dieser Name ist schon vergeben - bitte über "Ich bin schon bekannt" auswählen.');
  if (name.toLowerCase() === 'tim') { promptGodPassword(name); return; }
  if (globalSettings.lockNewIdentities) return alert('🔒 Das Anlegen neuer Spieler ist aktuell gesperrt.');
  finalizeGlobalIdentity(name);
}
// Klick auf eine bereits bekannte Identität in der Liste. Hat diese Identität ein eigenes
// Passwort (selbst vorgeschlagen + vom God bestätigt, oder direkt beim Turniererstellen
// gesetzt), gilt das jetzt identitätsweit für ALLE Turniere - deshalb wird es genau HIER,
// einmalig beim Anmelden, abgefragt (nicht mehr pro Turnier einzeln beim Betreten).
function selectGlobalExistingName(name) {
  if (name.trim().toLowerCase() === 'tim') { promptGodPassword(name); return; }
  const gp = getGlobalPlayer(name);
  if (gp && gp.password) {
    const knownVersion = parseInt(localStorage.getItem(myIdentityPwvStorageKey(name)) || '0', 10);
    const currentVersion = gp.passwordVersion || 0;
    if (knownVersion < currentVersion) { promptIdentityPassword(name); return; }
  }
  finalizeGlobalIdentity(name);
}
// Zeigt die God-Passwort-Abfrage im Identitäts-Modal
function promptGodPassword(name) {
  pendingGlobalLogin = { name };
  document.getElementById('global-role-options').style.display = 'none';
  document.getElementById('global-new-name-select').style.display = 'none';
  document.getElementById('global-existing-select').style.display = 'none';
  document.getElementById('global-god-password-select').style.display = 'block';
  document.getElementById('global-identity-password-select').style.display = 'none';
  const pwdInput = document.getElementById('global-god-password-input');
  if (pwdInput) pwdInput.value = '';
}
// Prüft das eingegebene God-Passwort (website-weit, gilt für den Namen "tim")
function confirmGodPassword() {
  const pwdInput = document.getElementById('global-god-password-input');
  const pwd = pwdInput ? pwdInput.value.trim() : '';
  if (!pendingGlobalLogin) return;
  if (pwd === GOD_PASSWORD) {
    const name = pendingGlobalLogin.name;
    pendingGlobalLogin = null;
    finalizeGlobalIdentity(name);
  } else {
    alert('Versuchs erst gar nicht');
  }
}
// Zeigt die persönliche Passwort-Abfrage im Identitäts-Modal (für alle Identitäten AUSSER
// "tim" - die haben sich das Passwort selbst gesetzt oder vom God bestätigen lassen)
function promptIdentityPassword(name) {
  pendingGlobalLogin = { name };
  document.getElementById('global-role-options').style.display = 'none';
  document.getElementById('global-new-name-select').style.display = 'none';
  document.getElementById('global-existing-select').style.display = 'none';
  document.getElementById('global-god-password-select').style.display = 'none';
  document.getElementById('global-identity-password-select').style.display = 'block';
  const textEl = document.getElementById('global-identity-password-prompt-text');
  if (textEl) textEl.innerText = `🔒 Passwort für ${name} eingeben:`;
  const pwdInput = document.getElementById('global-identity-password-input');
  if (pwdInput) pwdInput.value = '';
}
// Prüft das eingegebene persönliche Passwort einer Identität
function confirmIdentityPassword() {
  const pwdInput = document.getElementById('global-identity-password-input');
  const pwd = pwdInput ? pwdInput.value.trim() : '';
  if (!pendingGlobalLogin) return;
  const name = pendingGlobalLogin.name;
  const gp = getGlobalPlayer(name);
  if (gp && pwd === gp.password) {
    pendingGlobalLogin = null;
    finalizeGlobalIdentity(name);
  } else {
    alert('Falsches Passwort!');
  }
}
// Speichert die neue globale Identität lokal + in der website-weiten Registry und geht weiter
function finalizeGlobalIdentity(name) {
  myPlayerName = name;
  localStorage.setItem('fifa_global_name', name);
  if (!globalPlayers[name.toLowerCase()]) {
    db.ref('globalPlayers/' + name.toLowerCase()).set({ name, createdAt: Date.now() });
  }
  // Man hat sich gerade erfolgreich angemeldet (mit oder ohne Passwort nötig) -> ab jetzt auf
  // diesem Gerät als diese Identität vertraut, bis sich das Passwort mal ändert.
  markIdentityPasswordVersion(name);
  proceedAfterGlobalIdentity();
}
// Gibt die eigene Identität komplett auf (z.B. wenn ein anderer Spieler das Gerät übernimmt)
function switchUser() {
  localStorage.removeItem('fifa_global_name');
  myPlayerName = null;
  // WICHTIG: Alle gemerkten "auf diesem Gerät schon erfolgreich angemeldet"-Flags für
  // JEDES Turnier löschen. Sonst könnte auf einem geteilten Gerät jeder, der einfach nur
  // den richtigen NAMEN kennt, sich ohne Passwort als diese Person ausgeben, sobald diese
  // Person selbst vorher einmal erfolgreich eingeloggt war - "Wechseln" muss ein echter,
  // sauberer Neustart der Anmeldung sein.
  Object.keys(localStorage)
    .filter(k => k.startsWith('fifa_identity_pwv_'))
    .forEach(k => localStorage.removeItem(k));
  if (godOversightRef) { godOversightRef.off('value'); godOversightRef = null; }
  document.getElementById('app-header').style.display = 'none';
  document.getElementById('app-nav').style.display = 'none';
  document.getElementById('app-main').style.display = 'none';
  document.getElementById('landing-page').style.display = 'none';
  document.getElementById('tournament-join-modal').style.display = 'none';
  resetGlobalIdentitySelection();
  document.getElementById('global-identity-modal').style.display = 'flex';
}
// Blendet die Beitreten/Zuschauen- bzw. Passwort-Modals des aktuellen Turniers aus und
// zeigt die App (als Zuschauer oder angemeldeter Spieler dieses Turniers)
function enterAsSpectator() {
  document.getElementById('tournament-join-modal').style.display = 'none';
  document.getElementById('app-header').style.display = 'flex';
  document.getElementById('app-nav').style.display = 'flex';
  document.getElementById('app-main').style.display = 'block';
  // Rendert einmal den kompletten aktuellen Stand - wichtig, weil der Live-Listener beim
  // ALLERERSTEN Laden nach dem Betreten (siehe attachTournamentListener) hier abbricht,
  // BEVOR er selbst renderAll() aufruft (er wartet ja erst auf handleTournamentEntry()).
  // handleLiveDraftUI() ebenso - sonst würde eine schon laufende Live-Auslosung für wer
  // gerade erst (wieder-)betritt nicht als Overlay erscheinen, bis irgendwer anders als
  // Nächstes am Rad dreht.
  renderAll();
  handleLiveDraftUI();
  const adminBtn = document.getElementById('btn-admin');
  if (adminBtn) adminBtn.style.display = hasElevated() ? 'inline-block' : 'none';
  showTab('home');
}
// Klappt den Detailbereich im Header (Angemeldet als / Passwort vorschlagen / Wechseln-Buttons)
// auf oder zu - per Icon oben rechts im Header (siehe #header-toggle-btn in index.html)
function toggleHeaderDetails() {
  const container = document.getElementById('user-badge-container');
  const btn = document.getElementById('header-toggle-btn');
  if (!container) return;
  const isExpanded = container.classList.toggle('expanded');
  if (btn) btn.classList.toggle('expanded', isExpanded);
}
// Zeigt den Namens-Badge im Header + (falls zutreffend) den "Passwort vorschlagen"-Button
// bzw. den Hinweis, dass ein Passwort-Wunsch schon auf Bestätigung wartet.
function renderUserBadge() {
  // Name des aktuell geöffneten Turniers - im Header (klein unter dem Titel) und im
  // Browsertab-Titel, "und auch sonst an den passenden Stellen" wie gewünscht.
  const tournamentName = (currentTournamentId && tournamentsList[currentTournamentId]) ? tournamentsList[currentTournamentId].name : '';
  const tnameEl = document.getElementById('header-tournament-name');
  if (tnameEl) tnameEl.textContent = tournamentName ? '🏆 ' + tournamentName : '';
  // Titel im Header (und im Browsertab) passt sich der Sportart DIESES Turniers an (siehe tournamentSport)
  const appTitle = tournamentSport === 'darts' ? 'FAL Darts Turnier' : 'FAL FIFA Turnier';
  const titleEl = document.getElementById('app-title');
  if (titleEl) titleEl.textContent = appTitle;
  document.title = tournamentName ? `${tournamentName} — ${appTitle}` : appTitle;
  const userBadge = document.getElementById('user-badge');
  if (userBadge) {
    let roleTag = '';
    if (isGod()) roleTag = '👑 (God)';
    else if (isTournamentOwner()) roleTag = '⭐ (Admin)';
    else if (isRef()) roleTag = '🟨 (Ref)';
    else if (!getPlayerObj(myPlayerName)) roleTag = '👀 (Zuschauer hier)';
    userBadge.innerHTML = myPlayerName
      ? `Angemeldet als: <strong>${myPlayerName}</strong> ${roleTag}`
      : 'Modus: <strong>Zuschauer</strong>';
  }
  // Verbindungsstatus zu Firebase - nur für den God sichtbar (Fehlersuche-Werkzeug)
  const connBadge = document.getElementById('connection-status-badge');
  if (connBadge) {
    if (!isGod() || isFirebaseConnected === null) {
      connBadge.style.display = 'none';
    } else if (isFirebaseConnected) {
      connBadge.style.display = 'inline';
      connBadge.textContent = '🟢 Verbunden';
      connBadge.style.color = '#2ecc71';
    } else {
      connBadge.style.display = 'inline';
      connBadge.textContent = '🔴 Nicht verbunden';
      connBadge.style.color = '#ff4d4d';
    }
  }
  // Das Passwort ist jetzt identitätsweit (nicht mehr pro Turnier) - der "Vorschlagen"-Knopf
  // greift deshalb auf die globale Registry zu, nicht mehr auf den Spieler-Eintrag DIESES Turniers.
  const pwAction = document.getElementById('user-password-action');
  if (pwAction) {
    const gp = myPlayerName ? getGlobalPlayer(myPlayerName) : null;
    if (!myPlayerName || isGod() || (gp && gp.password)) {
      pwAction.innerHTML = '';
    } else if (gp && gp.pendingPassword) {
      pwAction.innerHTML = `<span style="font-size:0.8em; color:var(--fal-yellow); margin-left:10px;">⏳ Passwort-Wunsch wartet auf Bestätigung</span>`;
    } else {
      pwAction.innerHTML = `<button class="btn-secondary btn-sm" style="margin-left: 10px;" onclick="requestOwnPassword()">🔑 Passwort vorschlagen</button>`;
    }
  }
  // "Turnier verlassen" nur anzeigen, wenn man hier gerade wirklich Spieler ist (nicht nur Zuschauer)
  const leaveCell = document.getElementById('leave-tournament-cell');
  if (leaveCell) leaveCell.style.display = getPlayerObj(myPlayerName) ? 'flex' : 'none';
}
// Entscheidet beim (erneuten) Betreten eines Turniers automatisch, ob man direkt angemeldet
// wird, oder erst entscheiden muss, ob man beitritt oder nur zuschaut. Ein eigenes Passwort
// wird hier NICHT mehr abgefragt - das passiert seit dem Umbau auf identitätsweite Passwörter
// bereits einmalig beim Anmelden der Identität selbst (siehe selectGlobalExistingName). Läuft
// nur einmal pro Turnier-Aufruf (siehe tournamentEntryHandled).
function handleTournamentEntry() {
  const pObj = getPlayerObj(myPlayerName);
  if (pObj) { enterAsSpectator(); return; }
  showJoinOrSpectatePrompt();
}
// Zeigt das Beitreten/Zuschauen-Modal für ein Turnier, in dem man noch kein Spieler ist
function showJoinOrSpectatePrompt() {
  document.getElementById('tournament-join-modal').style.display = 'flex';
  document.getElementById('join-options').style.display = 'block';
  document.getElementById('join-tournament-password-select').style.display = 'none';
}
// Tritt dem aktuellen Turnier als vollwertiger Spieler bei (unter der globalen Identität)
function joinCurrentTournamentAsPlayer() {
  if (registrationLocked && !isGod()) return alert('Die Registrierung neuer Spieler wurde für dieses Turnier gesperrt.');
  if (getPlayerObj(myPlayerName)) { enterAsSpectator(); return; }
  // Turnier durch ein Beitritts-Passwort geschützt? (God kommt immer ohne rein)
  if (joinPassword && !isGod()) {
    document.getElementById('join-options').style.display = 'none';
    document.getElementById('join-tournament-password-select').style.display = 'block';
    const input = document.getElementById('join-tournament-password-input');
    if (input) input.value = '';
    return;
  }
  addSelfAsPlayer();
}
// Prüft das eingegebene Beitritts-Passwort und tritt bei Erfolg dem Turnier als Spieler bei
function confirmJoinPasswordAndJoin() {
  const input = document.getElementById('join-tournament-password-input');
  const pwd = input ? input.value.trim() : '';
  if (pwd !== joinPassword) return alert('Falsches Beitritts-Passwort!');
  addSelfAsPlayer();
}
// Fügt die eigene Identität zur Spielerliste hinzu - ATOMAR per Firebase-Transaction auf
// NUR dem players-Pfad, statt (wie früher) das komplette Turnier mit dem eigenen, evtl.
// bereits leicht veralteten lokalen Zustand zu überschreiben (saveData()). Traten zwei
// Leute fast gleichzeitig bei, konnte der zweite sonst den ersten unbemerkt wieder aus der
// Liste werfen, weil sein lokaler Stand noch nichts vom ersten Beitritt wusste - GENAU das
// war der gemeldete "Beitritt bleibt nicht gespeichert"-Bug. Die Transaction liest dagegen
// immer den aktuellen Server-Stand, bevor sie den neuen Spieler anhängt. Der lokale
// players-Array wird zusätzlich sofort (optimistisch) ergänzt, damit die eigene Oberfläche
// nicht erst auf die Server-Antwort warten muss - ein nachfolgendes Live-Update gleicht das
// bei Bedarf automatisch wieder ab.
function addSelfAsPlayer() {
  if (!currentTournamentId || !myPlayerName) return;
  const myKey = myPlayerName.trim().toLowerCase();
  if (!players.some(p => p.name.trim().toLowerCase() === myKey)) {
    players.push({ name: myPlayerName, isRef: false });
  }
  enterAsSpectator();
  db.ref('tournaments/' + currentTournamentId + '/players').transaction((currentPlayers) => {
    const list = currentPlayers || [];
    if (list.some(p => p && p.name && p.name.trim().toLowerCase() === myKey)) return list;
    return [...list, { name: myPlayerName, isRef: false }];
  }).catch((error) => alert('⚠️ Beitreten fehlgeschlagen:\n' + error.message));
}
// Schaut sich das Turnier nur an, ohne selbst Spieler zu werden
function spectateCurrentTournament() {
  enterAsSpectator();
}
// Meldet die eigene Identität als Spieler aus DIESEM Turnier ab (der Platz/Team/Wetten/Tipp
// gehen dabei verloren, wie auch wenn ein Admin einen Spieler entfernt) und geht zurück zur
// Turnierauswahl. Die globale Identität selbst bleibt unangetastet - man bleibt auf der
// Website "man selbst" und kann jederzeit erneut beitreten. Läuft - aus demselben Grund wie
// addSelfAsPlayer() - ebenfalls über eine Transaction auf NUR dem players-Pfad.
function leaveTournament() {
  const p = getPlayerObj(myPlayerName);
  if (!p) return;
  const warning = p.isTournamentOwner
    ? 'Du bist Ersteller/Admin dieses Turniers! Verlässt du es, hat hier (außer dem God) niemand mehr Admin-Rechte. Wirklich als Spieler austreten?'
    : 'Turnier wirklich als Spieler verlassen? Dein Team-Platz, deine Wetten und dein Tipp gehen dabei verloren.';
  if (!confirm(warning)) return;
  const tid = currentTournamentId;
  const myKey = myPlayerName.trim().toLowerCase();
  const idx = players.findIndex(pl => pl.name.toLowerCase() === myKey);
  if (idx !== -1) players.splice(idx, 1);
  goToLandingPage();
  db.ref('tournaments/' + tid + '/players').transaction((currentPlayers) => {
    const list = currentPlayers || [];
    return list.filter(pl => !(pl && pl.name && pl.name.trim().toLowerCase() === myKey));
  }).catch((error) => alert('⚠️ Verlassen fehlgeschlagen:\n' + error.message));
}
// Wird aufgerufen, wenn der eigene Spieler aus DIESEM Turnier entfernt wurde - die GLOBALE
// Identität bleibt dabei erhalten, nur die Anmeldung für dieses eine Turnier muss neu
// erfolgen (siehe handleTournamentEntry). Ein Passwort wird dabei NICHT mehr abgefragt (das
// läuft seit dem Umbau auf identitätsweite Passwörter separat, siehe forceIdentityReauth).
function forceBackToTournamentEntry(alertMessage) {
  document.getElementById('app-header').style.display = 'none';
  document.getElementById('app-nav').style.display = 'none';
  document.getElementById('app-main').style.display = 'none';
  tournamentEntryHandled = false;
  if (alertMessage) alert(alertMessage);
  handleTournamentEntry();
}
// Wechselt den sichtbaren Tab (Home/Teams/Gruppen/Spiele/Admin) und rendert ihn neu
function showTab(tabName) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
  const btn = document.getElementById(`btn-${tabName}`);
  const tab = document.getElementById(`tab-${tabName}`);
  if (btn) btn.classList.add('active');
  if (tab) tab.classList.add('active');
  if (tabName === 'matches') renderMatches();
  if (tabName === 'groups') renderGroups();
  if (tabName === 'admin') renderAdminPanel();
}
// ============================================================================
// 4. LIVE-SYNC VIA FIREBASE — hier läuft die "Magie" der Mehrgeräte-Synchronisation:
//    Sobald sich IRGENDWO etwas in der Datenbank ändert, feuert dieser Listener
//    bei ALLEN offenen Browsern/Handys und aktualisiert die komplette Anzeige.
// ============================================================================
// Firebase-eigener Spezial-Pfad, der anzeigt, ob GERADE eine echte Verbindung zum
// Server besteht. Steht die Anzeige oben rechts dauerhaft auf "Nicht verbunden",
// kommen Änderungen NICHT beim Server an, selbst wenn die Seite selbst normal aussieht
// (die Seite zeigt dann nur ihren eigenen Zwischenspeicher, siehe .catch() in saveData).
db.ref('.info/connected').on('value', (snap) => {
  isFirebaseConnected = (snap.val() === true);
  renderUserBadge();
});
// Setzt den kompletten lokalen Zustand auf die Ausgangswerte zurück. Wird beim Wechsel
// zu einem ANDEREN Turnier aufgerufen, damit nicht kurz die Daten des alten Turniers
// unter der neuen Oberfläche aufblitzen, während die neuen Daten noch laden.
function resetLocalStateToDefaults() {
  players = [];
  availableClubs = [...DEFAULT_CLUBS];
  clubLogos = { ...DEFAULT_CLUB_LOGOS };
  teams = [];
  tournamentMode = 'duo';
  tournamentSport = 'fifa';
  plannedPlayerCount = null;
  numGroups = 3;
  koQualifiersTotal = null;
  koByeTeamIds = [];
  matchIntervalMinutes = 20;
  draftCheats = [];
  groups = [];
  groupMatches = [];
  koMatches = [];
  rules = DEFAULT_RULES;
  tips = {};
  tipsEvaluated = false;
  registrationLocked = false;
  joinPassword = null;
  coinAnimation = 'none';
  draftState = { active: false, currentStep: 0, tempP1: null, tempP2: null, remainingPlayers: [], remainingClubs: [], spinning: false, startTime: null, targetAngle: 0, duration: 4000, lastDrawnItem: null, pairs: [], pendingTarget: null };
  groupDraftState = { active: false, spinning: false, remainingTeams: [], groupLetters: [], targetGroupIndex: 0, assignments: {}, lastDrawnItem: null, lastAssignedGroup: null, startTime: null, targetAngle: 0, duration: 4000, pendingTarget: null };
  userBalances = {};
  bets = [];
  tournamentEntryHandled = false;
  myPlayerWasPresent = false;
}
// Hängt den Live-Sync für EIN bestimmtes Turnier ein (tournaments/{currentTournamentId}).
// Löst zuerst einen eventuell noch aktiven Listener eines ANDEREN Turniers, damit nicht
// zwei Turniere gleichzeitig mitgehört werden (siehe enterTournament/goToLandingPage).
function attachTournamentListener() {
  if (tournamentRef) { tournamentRef.off('value'); tournamentRef = null; }
  if (!currentTournamentId) return;
  tournamentRef = db.ref('tournaments/' + currentTournamentId);
  tournamentRef.on('value', (snapshot) => {
    const data = snapshot.val() || {};
    let rawPlayers = data.players || [];
    players = rawPlayers.map(p => typeof p === 'string' ? { name: p, isRef: false, password: null } : p);
    availableClubs = data.availableClubs || [...DEFAULT_CLUBS];
    // Nur beim allerersten Laden (noch nie gespeichert) mit den Standard-Wappen befüllen -
    // danach gilt immer exakt das, was gespeichert wurde (auch wenn der Admin ein Wappen
    // bewusst entfernt hat, siehe setClubLogo).
    clubLogos = data.clubLogos || { ...DEFAULT_CLUB_LOGOS };
    teams = data.teams || [];
    tournamentMode = data.tournamentMode || 'duo';
    tournamentSport = data.tournamentSport || 'fifa';
    plannedPlayerCount = data.plannedPlayerCount || null;
    numGroups = data.numGroups || 3;
    koQualifiersTotal = data.koQualifiersTotal || null;
    koByeTeamIds = data.koByeTeamIds || [];
    matchIntervalMinutes = data.matchIntervalMinutes || 20;
    draftCheats = data.draftCheats || [];
    groups = data.groups || [];
    groupMatches = data.groupMatches || [];
    koMatches = data.koMatches || [];
    rules = data.rules || DEFAULT_RULES;
    tips = data.tips || {};
    tipsEvaluated = data.tipsEvaluated || false;
    registrationLocked = data.registrationLocked || false;
    joinPassword = data.joinPassword || null;
    coinAnimation = data.coinAnimation || 'none';
    draftState = data.draftState || { active: false, currentStep: 0, tempP1: null, tempP2: null, remainingPlayers: [], remainingClubs: [], spinning: false, startTime: null, targetAngle: 0, duration: 4000, lastDrawnItem: null, pairs: [] };
    groupDraftState = data.groupDraftState || { active: false, spinning: false, remainingTeams: [], groupLetters: [], targetGroupIndex: 0, assignments: {}, lastDrawnItem: null, lastAssignedGroup: null, startTime: null, targetAngle: 0, duration: 4000 };
    userBalances = data.userBalances || {};
    bets = data.bets || [];

    // Beim allerersten Laden nach dem Betreten entscheidet handleTournamentEntry(), ob man
    // automatisch angemeldet wird, ein Passwort braucht, oder erst Beitreten/Zuschauen wählen muss.
    if (!tournamentEntryHandled) {
      tournamentEntryHandled = true;
      myPlayerWasPresent = !!(myPlayerName && getPlayerObj(myPlayerName));
      handleTournamentEntry();
      return;
    }
    // Wurde man inzwischen aus DIESEM Turnier entfernt (vorher Spieler hier, jetzt nicht mehr)?
    // Reines Zuschauen (nie Spieler gewesen) löst das bewusst NICHT aus.
    const amIPresentNow = !!(myPlayerName && getPlayerObj(myPlayerName));
    if (myPlayerWasPresent && !amIPresentNow) {
      myPlayerWasPresent = false;
      forceBackToTournamentEntry('Du wurdest aus diesem Turnier entfernt.');
      return;
    }
    myPlayerWasPresent = amIPresentNow;
    // Ein neu gesetztes/bestätigtes Passwort wird nicht mehr hier geprüft (das Passwort ist
    // jetzt identitätsweit, siehe attachGlobalPlayersListener), sondern zentral für alle
    // Turniere gemeinsam.
    renderAll();
    handleLiveDraftUI();
  }, (error) => {
    // Wird z.B. ausgelöst, wenn die Firebase-Datenbankregeln das Lesen verbieten
    console.error('Firebase Lese-Fehler:', error);
    alert('⚠️ Verbindung zur Datenbank fehlgeschlagen!\n\n' + error.message + '\n\nBitte die Firebase-Datenbankregeln prüfen.');
  });
}
// Schreibt den kompletten aktuellen Zustand des AKTIVEN Turniers in Firebase zurück
// (löst bei ALLEN Geräten, die dasselbe Turnier offen haben, ein Update aus)
function saveData() {
  if (!currentTournamentId) return;
  db.ref('tournaments/' + currentTournamentId).set({
    players,
    availableClubs,
    clubLogos,
    teams,
    tournamentMode,
    tournamentSport,
    plannedPlayerCount,
    numGroups,
    koQualifiersTotal,
    koByeTeamIds,
    matchIntervalMinutes,
    draftCheats,
    groups,
    groupMatches,
    koMatches,
    rules,
    tips,
    tipsEvaluated,
    registrationLocked,
    joinPassword,
    coinAnimation,
    draftState,
    groupDraftState,
    userBalances,
    bets
  }).catch((error) => {
    // Ohne diesen Catch-Block schlägt ein blockiertes Speichern (z.B. durch zu strenge
    // Firebase-Regeln) KOMPLETT UNBEMERKT fehl -> genau das war vermutlich der Grund,
    // warum "die Datenbank nicht speichert". Jetzt gibt es stattdessen eine klare Meldung.
    console.error('Firebase Speicher-Fehler:', error);
    alert('⚠️ Speichern fehlgeschlagen!\n\n' + error.message + '\n\nBitte die Firebase-Datenbankregeln prüfen (Firebase-Konsole -> Realtime Database -> Regeln).');
  });
}
// ============================================================================
// 4b. TURNIER-AUSWAHL — die Startseite NACH der globalen Identität: hier wählt man,
//     welchem Turnier man beitritt (oder erstellt ein neues). Jedes Turnier lebt
//     komplett getrennt unter tournaments/{id} in Firebase.
// ============================================================================
// Lädt fortlaufend die Liste ALLER existierenden Turniere (nur Name + Erstelldatum +
// Ersteller, nicht die kompletten Turnierdaten) für die Startseite.
function attachTournamentsMetaListener() {
  db.ref('tournaments_meta').on('value', (snap) => {
    tournamentsList = snap.val() || {};
    renderLandingPage();
  }, (error) => {
    console.error('Firebase Lese-Fehler (tournaments_meta):', error);
    alert('⚠️ Turnierliste konnte nicht geladen werden!\n\n' + error.message + '\n\nBitte die Firebase-Datenbankregeln für den Pfad "tournaments_meta" prüfen.');
  });
}
// Baut die Liste der Turniere auf der Startseite auf (neueste zuerst) + das Formular
// für ein neues Turnier (gesperrt, falls der God das Erstellen deaktiviert hat) + das
// God-Panel (nur für "tim" sichtbar).
function renderLandingPage() {
  const container = document.getElementById('landing-page-list');
  if (container) {
    const ids = Object.keys(tournamentsList).sort((a, b) => (tournamentsList[b].createdAt || 0) - (tournamentsList[a].createdAt || 0));
    if (ids.length === 0) {
      container.innerHTML = '<p class="empty-state">Noch keine Turniere vorhanden. Erstelle unten das erste!</p>';
    } else {
      container.innerHTML = ids.map(id => {
        const t = tournamentsList[id] || {};
        const metaParts = [];
        if (t.createdBy) metaParts.push(`von <strong>${escapeHtml(t.createdBy)}</strong>`);
        if (t.createdAt) metaParts.push(`am ${new Date(t.createdAt).toLocaleDateString('de-DE')}`);
        return `
          <div style="display:flex; align-items:stretch; gap:6px; margin:4px 0;">
            <button class="btn-secondary role-btn" style="text-align:left; flex:1; margin:0;" onclick="enterTournament('${id}')">
              🏆 ${escapeHtml(t.name)}
              ${metaParts.length ? `<div style="font-size:0.75em; opacity:0.7; font-weight:normal; margin-top:2px;">${metaParts.join(' ')}</div>` : ''}
            </button>
            ${isGod() ? `
              <button class="btn-secondary btn-sm" title="Umbenennen" onclick="renameTournamentAsGod('${id}')">✏️</button>
              <button class="btn-danger btn-sm" title="Löschen" onclick="deleteTournamentAsGod('${id}')">🗑️</button>
            ` : ''}
          </div>
        `;
      }).join('');
    }
  }
  const newTournamentSection = document.getElementById('new-tournament-section');
  if (newTournamentSection) {
    if (globalSettings.lockNewTournaments && !isGod()) {
      newTournamentSection.innerHTML = '<p class="empty-state">🔒 Das Erstellen neuer Turniere ist aktuell gesperrt.</p>';
    } else {
      newTournamentSection.innerHTML = `
        <div style="width:100%;">
          <div style="display:flex; gap:8px; margin-bottom:8px;">
            <input type="text" id="new-tournament-name" placeholder="Name für neues Turnier..." style="flex:1;">
            <button class="btn-primary" onclick="startCreateTournament()">+ Neu</button>
          </div>
          <button class="btn-secondary" style="width:100%;" onclick="openFormatWizard()">🧙 Turnier per Beschreibung anlegen</button>
        </div>
      `;
    }
  }
  renderGodPanelButton();
  renderGodPanel();
  renderInvites();
}
// Baut nur den "God-Panel öffnen"-Knopf (mit Hinweis-Badge bei offenen Passwort-Wünschen)
// auf der Turnierauswahl-Seite - eigene Funktion statt Teil von renderLandingPage(), damit
// sie auch bei Live-Updates aus attachGodOversightListener aufgerufen werden kann, OHNE dabei
// z.B. das "Name für neues Turnier"-Eingabefeld mitten in der Eingabe zu überschreiben.
function renderGodPanelButton() {
  const godButtonContainer = document.getElementById('god-panel-button-container');
  if (!godButtonContainer) return;
  if (!isGod()) { godButtonContainer.innerHTML = ''; return; }
  const pendingCount = countPendingGlobalPasswords();
  godButtonContainer.innerHTML = `
    <button class="btn-secondary" style="width:100%; margin-bottom:12px; display:flex; align-items:center; justify-content:center; gap:8px;" onclick="openGodPanel()">
      👑 God-Panel öffnen
      ${pendingCount > 0 ? `<span style="background:var(--fal-yellow); color:#000; border-radius:10px; padding:1px 8px; font-size:0.8em; font-weight:bold;">${pendingCount}</span>` : ''}
    </button>
  `;
}
// Zählt offene Passwort-Wünsche (identitätsweit, nicht mehr pro Turnier) - für das
// Hinweis-Badge auf dem "God-Panel öffnen"-Knopf, damit man nicht extra reinklicken muss.
function countPendingGlobalPasswords() {
  return Object.keys(globalPlayers).filter(key => globalPlayers[key] && globalPlayers[key].pendingPassword).length;
}
// Öffnet den eigenen God-Panel-Screen (nur der God selbst)
function openGodPanel() {
  if (!isGod()) return;
  document.getElementById('god-panel-modal').style.display = 'flex';
}
// Schließt den God-Panel-Screen wieder, zurück zur Turnierauswahl
function closeGodPanel() {
  document.getElementById('god-panel-modal').style.display = 'none';
}
// ============================================================================
// 4b-i. TURNIER-FORMAT-ASSISTENT — Freitext-Beschreibung ("18 Spieler in 4 Gruppen
//     losen") wird lokal (OHNE externe KI/API, komplett kostenlos) in ein Turnierformat
//     übersetzt: Ziel-Spieleranzahl, Gruppenanzahl, Duo- oder Solo-Modus. Das Ergebnis wird
//     IMMER erst als editierbare Vorschau gezeigt, bevor irgendetwas angelegt wird - falls
//     die Erkennung mal danebenliegt, lässt sich das direkt korrigieren.
// ============================================================================
let pendingNewTournamentFormat = null; // { mode, numGroups, playerCount } - von confirmFormatWizardPreview() bis finalizeCreateTournament()
let wizardTournamentName = '';         // Zwischenspeicher für den im Wizard eingegebenen Namen
const GERMAN_NUMBER_WORDS = { 'zwei': 2, 'drei': 3, 'vier': 4, 'fünf': 5, 'sechs': 6, 'sieben': 7, 'acht': 8, 'neun': 9, 'zehn': 10, 'elf': 11, 'zwölf': 12 };
// Sucht die erste Zahl (Ziffern oder ausgeschriebenes deutsches Zahlwort bis zwölf), die
// unmittelbar vor einem der übergebenen Wörter steht - toleriert dabei ein optionales
// "<Zahl>er"-Größenwort dazwischen (z.B. "4 4er Gruppen" -> 4, nicht die zweite 4).
function extractNumberBefore(text, words) {
  const wordPattern = words.join('|');
  const digitMatch = text.match(new RegExp('(\\d+)\\s+(?:\\d+er\\s+)?(?:' + wordPattern + ')', 'i'));
  if (digitMatch) return parseInt(digitMatch[1], 10);
  const wordNumPattern = Object.keys(GERMAN_NUMBER_WORDS).join('|');
  const wordMatch = text.match(new RegExp('(' + wordNumPattern + ')\\s+(?:' + wordPattern + ')', 'i'));
  if (wordMatch) return GERMAN_NUMBER_WORDS[wordMatch[1].toLowerCase()];
  return null;
}
// Analysiert eine deutsche Freitext-Beschreibung eines Turnierformats. Rein lokale
// Muster-Erkennung (Regex), keine externe KI/API nötig - dafür kostenlos, sofort und
// funktioniert offline. Deckt die gängigen Formulierungen ab ("X Spieler", "in Y Gruppen",
// "jeder bekommt einen Verein" usw.), aber nicht jede denkbare Formulierung - deshalb wird
// das Ergebnis in renderFormatWizardPreview() immer noch mal zum Bestätigen/Korrigieren gezeigt.
// Erkennt, wie viele Teams INSGESAMT in die KO-Runde einziehen sollen, aus Formulierungen
// wie "top 16", "die besten 8 kommen weiter", "16 kommen ins Achtelfinale", "16 in die KO-Runde".
function extractKOQualifiers(text) {
  let m = text.match(/top\s*(\d+)/i);
  if (m) return parseInt(m[1], 10);
  m = text.match(/(?:die\s+)?besten\s+(\d+)/i);
  if (m) return parseInt(m[1], 10);
  m = text.match(/(\d+)\s*(?:mannschaften|teams)?\s*(?:kommen|ziehen|qualifizieren sich)\s*(?:sich\s*)?(?:weiter|in\s*die\s*ko|ins\s*achtelfinale|ins\s*viertelfinale|ins\s*sechzehntelfinale|in\s*die\s*k\.?o\.?-?runde)/i);
  if (m) return parseInt(m[1], 10);
  m = text.match(/(\d+)\s*(?:im|ins)\s*(?:achtelfinale|viertelfinale|halbfinale|sechzehntelfinale|ko|k\.?o\.?)/i);
  if (m) return parseInt(m[1], 10);
  return null;
}
function parseTournamentFormatText(text) {
  const notes = [];
  const playerCount = extractNumberBefore(text, ['spieler', 'leute', 'personen', 'teilnehmer']);
  if (playerCount) notes.push(`Spieleranzahl erkannt: ${playerCount}`);
  else notes.push('Spieleranzahl nicht erkannt - trag sie unten selbst ein (nur zur eigenen Orientierung).');

  let numGroups = extractNumberBefore(text, ['gruppen', 'töpfe', 'pots']);
  if (numGroups && (numGroups < 2 || numGroups > 26)) {
    notes.push(`${numGroups} Gruppen erkannt, das liegt aber außerhalb des unterstützten Bereichs (2-26) - bitte unten korrigieren.`);
    numGroups = null;
  } else if (numGroups) {
    notes.push(`Gruppenanzahl erkannt: ${numGroups}`);
  }

  const koQualifiers = extractKOQualifiers(text);
  if (koQualifiers) notes.push(`KO-Teilnehmerzahl erkannt: ${koQualifiers} Teams insgesamt (Rest wird per Quervergleich der nächstplatzierten Teams aufgefüllt, falls nötig).`);

  // Solo/Einzel-Hinweise: "jeder bekommt einen Verein", "Einzelturnier", "keine 2er-Teams" usw.
  const soloPatterns = [
    /jeder\s+(spieler\s+)?(bekommt|kriegt|erh(ä|ae)lt)[^.]{0,30}?(club|verein)/i,
    /\beinzel(turnier|modus|spiel)?\b/i,
    /kein(e)?\s+(2er[- ]?)?teams?/i,
    /ohne\s+partner/i,
    /jeder\s+(spieler\s+)?(f(ü|ue)r sich|allein(e)?|solo)/i
  ];
  // Sportart erkennen: "Darts"/"Dart-Turnier" -> kein Verein, automatisch Einzel-Modus
  // (bei Darts gibt's kein Partner-Konzept, siehe createDartsTeamsFromPlayers).
  const sport = /\bdarts?\b/i.test(text) ? 'darts' : 'fifa';
  const mode = sport === 'darts' ? 'solo' : (soloPatterns.some(re => re.test(text)) ? 'solo' : 'duo');
  if (sport === 'darts') {
    notes.push('🎯 Darts-Turnier erkannt: läuft automatisch im Einzel-Modus, ganz ohne Vereine.');
  } else {
    notes.push(mode === 'solo'
      ? '👤 Einzel-Modus erkannt: jeder Spieler bekommt seinen eigenen Verein (kein Partner).'
      : '👬 Standard-Modus: 2er-Teams, die sich einen Verein teilen.');
  }

  // Rein informative Notiz zu ungleichen Gruppengrößen ("4 bzw 5", "4 oder 5") - wird nicht
  // gesondert gespeichert, weil die bestehende Auslosung Restspieler ohnehin automatisch
  // gleichmäßig auf die Gruppen verteilt (siehe quickDrawGroups()/startGroupDraft()).
  const unevenMatch = text.match(/(\d+)\s*(?:bzw\.?|oder|-)\s*(\d+)\s*(?:er)?\s*(pro\s+gruppe|spieler|teams?)?/i);
  if (unevenMatch) notes.push(`Hinweis: unterschiedliche Gruppengrößen (${unevenMatch[1]}/${unevenMatch[2]}) werden bei der Auslosung automatisch möglichst gleichmäßig verteilt.`);

  return { playerCount, numGroups, koQualifiers, mode, sport, notes };
}
// Öffnet den Format-Assistenten (Schritt 1: Name + optionale Freitext-Beschreibung)
function openFormatWizard() {
  if (globalSettings.lockNewTournaments && !isGod()) return alert('🔒 Das Erstellen neuer Turniere ist aktuell gesperrt.');
  renderFormatWizardStep1();
  document.getElementById('format-wizard-modal').style.display = 'flex';
}
function closeFormatWizard() {
  document.getElementById('format-wizard-modal').style.display = 'none';
}
function renderFormatWizardStep1() {
  const container = document.getElementById('format-wizard-container');
  if (!container) return;
  const nameInput = document.getElementById('new-tournament-name');
  container.innerHTML = `
    <h3 style="margin-top:0;">🧙 Neues Turnier per Beschreibung</h3>
    <p style="font-size:0.85em; opacity:0.8; margin-bottom:4px;">Name für das Turnier:</p>
    <input type="text" id="wizard-tournament-name" placeholder="z.B. Sommer-Cup 2026" value="${escapeHtml((nameInput && nameInput.value) || '')}" style="width:100%; box-sizing:border-box; padding:8px; margin-bottom:12px;">
    <p style="font-size:0.85em; opacity:0.8; margin-bottom:4px;">
      Beschreibe optional in eigenen Worten, wie das Turnier ablaufen soll, z.B.:<br>
      <em>"Ich habe 18 Spieler und will die in 4 Gruppen à 4 bzw. 5 losen"</em><br>
      <em>"20 Spieler auf 2 Gruppen aufteilen"</em><br>
      <em>"16 Spieler, jeder bekommt einen Verein zugelost, dann 4er-Gruppen"</em>
    </p>
    <textarea id="wizard-format-text" rows="4" placeholder="Turnierformat beschreiben (optional)..." style="width:100%; box-sizing:border-box; padding:8px; margin-bottom:12px;"></textarea>
    <div style="display:flex; gap:8px;">
      <button class="btn-secondary" style="flex:1;" onclick="closeFormatWizard()">Abbrechen</button>
      <button class="btn-primary" style="flex:1;" onclick="analyzeFormatWizardText()">Weiter</button>
    </div>
  `;
}
// Liest Name + Beschreibungstext, analysiert (falls vorhanden) und zeigt die Vorschau -
// ohne Text wird mit den Standard-Einstellungen (Duo-Modus, Gruppenanzahl später) fortgefahren.
function analyzeFormatWizardText() {
  const nameInput = document.getElementById('wizard-tournament-name');
  const name = nameInput ? nameInput.value.trim() : '';
  if (!name) return alert('Bitte einen Namen für das Turnier eingeben!');
  wizardTournamentName = name;
  const textInput = document.getElementById('wizard-format-text');
  const text = textInput ? textInput.value.trim() : '';
  if (!text) { proceedFromFormatWizard({ mode: 'duo', sport: 'fifa', numGroups: null, playerCount: null, koQualifiers: null }); return; }
  renderFormatWizardPreview(parseTournamentFormatText(text));
}
// Zeigt die editierbare Vorschau des erkannten Formats (Schritt 2)
function renderFormatWizardPreview(parsed) {
  const container = document.getElementById('format-wizard-container');
  if (!container) return;
  container.innerHTML = `
    <h3 style="margin-top:0;">🧙 Verstanden?</h3>
    <p style="font-size:0.85em; opacity:0.8; margin-bottom:8px;">So habe ich deine Beschreibung interpretiert - prüfe kurz, ob das passt, und korrigiere bei Bedarf:</p>
    <div style="font-size:0.8em; opacity:0.75; margin-bottom:12px; background:rgba(0,0,0,0.2); padding:8px; border-radius:8px;">${parsed.notes.map(n => `• ${escapeHtml(n)}`).join('<br>')}</div>
    <label style="display:block; font-size:0.85em; margin-bottom:4px;">Erwartete Spieleranzahl (nur zur eigenen Orientierung):</label>
    <input type="number" id="wizard-player-count" min="1" value="${parsed.playerCount || ''}" placeholder="unbekannt" style="width:100%; box-sizing:border-box; padding:8px; margin-bottom:10px;">
    <label style="display:block; font-size:0.85em; margin-bottom:4px;">Sportart:</label>
    <div style="display:flex; gap:10px; margin-bottom:10px;">
      <label style="flex:1; display:flex; align-items:center; gap:6px; background:rgba(0,0,0,0.2); padding:8px; border-radius:8px; cursor:pointer;">
        <input type="radio" name="wizard-sport" value="fifa" ${parsed.sport !== 'darts' ? 'checked' : ''}> ⚽ FIFA
      </label>
      <label style="flex:1; display:flex; align-items:center; gap:6px; background:rgba(0,0,0,0.2); padding:8px; border-radius:8px; cursor:pointer;">
        <input type="radio" name="wizard-sport" value="darts" ${parsed.sport === 'darts' ? 'checked' : ''}> 🎯 Darts
      </label>
    </div>
    <label style="display:block; font-size:0.85em; margin-bottom:4px;">Modus (bei Darts immer Einzel):</label>
    <div style="display:flex; gap:10px; margin-bottom:10px;">
      <label style="flex:1; display:flex; align-items:center; gap:6px; background:rgba(0,0,0,0.2); padding:8px; border-radius:8px; cursor:pointer;">
        <input type="radio" name="wizard-mode" value="duo" ${parsed.mode === 'duo' ? 'checked' : ''}> 👬 2er-Teams
      </label>
      <label style="flex:1; display:flex; align-items:center; gap:6px; background:rgba(0,0,0,0.2); padding:8px; border-radius:8px; cursor:pointer;">
        <input type="radio" name="wizard-mode" value="solo" ${parsed.mode === 'solo' ? 'checked' : ''}> 🧍 Einzel
      </label>
    </div>
    <label style="display:block; font-size:0.85em; margin-bottom:4px;">Gruppenanzahl (beliebig, min. 2 - leer lassen, um es später beim Auslosen festzulegen):</label>
    <input type="number" id="wizard-num-groups" min="2" max="26" value="${parsed.numGroups || ''}" placeholder="später festlegen" style="width:100%; box-sizing:border-box; padding:8px; margin-bottom:10px;">
    <label style="display:block; font-size:0.85em; margin-bottom:4px;">Wie viele Teams sollen insgesamt in die KO-Runde einziehen? (optional - leer lassen, um es später festzulegen)</label>
    <input type="number" id="wizard-ko-qualifiers" min="2" value="${parsed.koQualifiers || ''}" placeholder="später festlegen" style="width:100%; box-sizing:border-box; padding:8px; margin-bottom:14px;">
    <div style="display:flex; gap:8px;">
      <button class="btn-secondary" style="flex:1;" onclick="renderFormatWizardStep1()">‹ Zurück</button>
      <button class="btn-primary" style="flex:1;" onclick="confirmFormatWizardPreview()">Turnier erstellen</button>
    </div>
  `;
}
function confirmFormatWizardPreview() {
  const playerCountInput = document.getElementById('wizard-player-count');
  const numGroupsInput = document.getElementById('wizard-num-groups');
  const koQualifiersInput = document.getElementById('wizard-ko-qualifiers');
  const modeInput = document.querySelector('input[name="wizard-mode"]:checked');
  const sportInput = document.querySelector('input[name="wizard-sport"]:checked');
  const sport = sportInput ? sportInput.value : 'fifa';
  proceedFromFormatWizard({
    mode: sport === 'darts' ? 'solo' : (modeInput ? modeInput.value : 'duo'),
    sport,
    numGroups: numGroupsInput && numGroupsInput.value ? parseInt(numGroupsInput.value, 10) : null,
    playerCount: playerCountInput && playerCountInput.value ? parseInt(playerCountInput.value, 10) : null,
    koQualifiers: koQualifiersInput && koQualifiersInput.value ? parseInt(koQualifiersInput.value, 10) : null
  });
}
// Übernimmt das (ggf. von Hand korrigierte) Format und übergibt an den bestehenden
// Namens-/Passwort-Ablauf (startCreateTournament -> ... -> finalizeCreateTournament), der
// dafür unverändert weiterläuft - das Format wird nur zwischengespeichert (siehe oben).
function proceedFromFormatWizard(format) {
  closeFormatWizard();
  pendingNewTournamentFormat = format;
  const nameInput = document.getElementById('new-tournament-name');
  if (nameInput) nameInput.value = wizardTournamentName;
  startCreateTournament();
}
// Schritt 1 der Turniererstellung: Name prüfen. Hat die eigene Identität schon ein
// (identitätsweites) Passwort, ist man damit automatisch auch Admin jedes selbst erstellten
// Turniers - ein extra Admin-Passwort abzufragen wäre dann überflüssig, also wird Schritt 2
// übersprungen. Ohne bestehendes Passwort darf man optional gleich eines festlegen (das dann
// ab sofort für ALLE Turniere gilt, nicht nur für dieses).
function startCreateTournament() {
  if (globalSettings.lockNewTournaments && !isGod()) return alert('🔒 Das Erstellen neuer Turniere ist aktuell gesperrt.');
  const input = document.getElementById('new-tournament-name');
  const name = input ? input.value.trim() : '';
  if (!name) return alert('Bitte einen Namen für das neue Turnier eingeben!');
  // God hat website-weit ohnehin schon in JEDEM Turnier automatisch Admin-Rechte (siehe
  // isAdmin/isGod) - ein zusätzliches, identitätsweites Admin-Passwort für sich selbst
  // festzulegen wäre für ihn überflüssig, genau wie für alle, die schon eins haben.
  const gp = getGlobalPlayer(myPlayerName);
  if (isGod() || (gp && gp.password)) {
    pendingNewTournament = { name };
    document.getElementById('tournament-join-password-modal').style.display = 'flex';
    const jpInput = document.getElementById('new-tournament-join-password');
    if (jpInput) jpInput.value = '';
    return;
  }
  document.getElementById('tournament-create-password-modal').style.display = 'flex';
  const pwdInput = document.getElementById('new-tournament-password');
  if (pwdInput) pwdInput.value = '';
}
function cancelCreateTournament() {
  document.getElementById('tournament-create-password-modal').style.display = 'none';
}
// Schritt 2 (nur falls noch kein eigenes Passwort existiert): merkt sich Name + das neu
// gewählte, ab sofort identitätsweit gültige Passwort und fragt danach (noch OHNE das
// Turnier anzulegen) optional ein Beitritts-Passwort ab - siehe finalizeCreateTournament.
function confirmCreateTournament() {
  const nameInput = document.getElementById('new-tournament-name');
  const name = nameInput ? nameInput.value.trim() : '';
  const pwdInput = document.getElementById('new-tournament-password');
  const pwd = pwdInput ? pwdInput.value.trim() : '';
  if (!name) return alert('Bitte einen Namen für das neue Turnier eingeben!');
  if (!pwd) return alert('Bitte ein Admin-Passwort festlegen!');
  pendingNewTournament = { name, newOwnerPassword: pwd };
  document.getElementById('tournament-create-password-modal').style.display = 'none';
  document.getElementById('tournament-join-password-modal').style.display = 'flex';
  const jpInput = document.getElementById('new-tournament-join-password');
  if (jpInput) jpInput.value = '';
}
// Schritt 3 (optional übersprungen): kein Beitritts-Passwort für dieses Turnier
function skipTournamentJoinPassword() {
  finalizeCreateTournament(null);
}
// Schritt 3: Beitritts-Passwort wurde festgelegt
function confirmTournamentJoinPassword() {
  const input = document.getElementById('new-tournament-join-password');
  const pwd = input ? input.value.trim() : '';
  finalizeCreateTournament(pwd || null);
}
// Legt das Turnier tatsächlich an: macht die eigene Identität zum Admin dieses einen
// Turniers (isTournamentOwner), setzt optional das Beitritts-Passwort für NEUE Spieler,
// und tritt direkt bei. Ein evtl. gerade neu gewähltes Admin-Passwort wird identitätsweit
// (in der globalen Registry) gespeichert, nicht mehr am Turnier selbst.
function finalizeCreateTournament(joinPwd) {
  if (!pendingNewTournament) return;
  const { name, newOwnerPassword } = pendingNewTournament;
  pendingNewTournament = null;
  const myKey = myPlayerName.trim().toLowerCase();
  if (newOwnerPassword) {
    const gp = getGlobalPlayer(myPlayerName);
    db.ref('globalPlayers/' + myKey).update({
      password: newOwnerPassword,
      passwordVersion: ((gp && gp.passwordVersion) || 0) + 1
    }).catch((error) => alert('⚠️ Passwort konnte nicht gespeichert werden:\n' + error.message));
    // Das Passwort wurde gerade selbst festgelegt -> nicht direkt nochmal danach fragen
    localStorage.setItem(myIdentityPwvStorageKey(myPlayerName), String(((gp && gp.passwordVersion) || 0) + 1));
  }
  const newRef = db.ref('tournaments_meta').push();
  const id = newRef.key;
  newRef.set({ name, createdAt: Date.now(), createdBy: myPlayerName }).catch((error) => {
    alert('⚠️ Turnier konnte nicht erstellt werden:\n' + error.message);
  });
  // Format-Wizard-Ergebnis übernehmen (siehe openFormatWizard) - optional, wird beim
  // einfachen "+ Neu"-Weg ohne Beschreibung einfach übersprungen (dann gelten die Standards).
  const format = pendingNewTournamentFormat || {};
  pendingNewTournamentFormat = null;
  db.ref('tournaments/' + id).set({
    players: [{ name: myPlayerName, isRef: false, isTournamentOwner: true }],
    joinPassword: joinPwd,
    tournamentMode: format.mode === 'solo' ? 'solo' : 'duo',
    tournamentSport: format.sport === 'darts' ? 'darts' : 'fifa',
    numGroups: format.numGroups || 3,
    plannedPlayerCount: format.playerCount || null,
    koQualifiersTotal: format.koQualifiers || null
  }).catch((error) => {
    alert('⚠️ Turnier konnte nicht erstellt werden:\n' + error.message);
  });
  document.getElementById('tournament-join-password-modal').style.display = 'none';
  document.getElementById('landing-page').style.display = 'none';
  resetLocalStateToDefaults();
  currentTournamentId = id;
  localStorage.setItem('fifa_current_tournament', id);
  tournamentEntryHandled = true;
  myPlayerWasPresent = true;
  attachTournamentListener();
  enterAsSpectator();
}
// Tritt einem BESTEHENDEN Turnier bei: hängt den Live-Sync dafür ein - handleTournamentEntry()
// entscheidet dann (sobald die Daten geladen sind) automatisch, ob man direkt angemeldet
// wird, ein Passwort braucht, oder erst Beitreten/Zuschauen wählen muss.
function enterTournament(id) {
  resetLocalStateToDefaults(); // verhindert, dass kurz Daten des vorherigen Turniers aufblitzen
  currentTournamentId = id;
  localStorage.setItem('fifa_current_tournament', id);
  document.getElementById('landing-page').style.display = 'none';
  attachTournamentListener();
}
// Verlässt das aktuelle Turnier und zeigt wieder die Turnierauswahl-Startseite.
// Die GLOBALE Identität bleibt dabei erhalten (man ist website-weit weiterhin dieselbe Person).
function goToLandingPage() {
  if (tournamentRef) { tournamentRef.off('value'); tournamentRef = null; }
  currentTournamentId = null;
  localStorage.removeItem('fifa_current_tournament');
  document.getElementById('app-header').style.display = 'none';
  document.getElementById('app-nav').style.display = 'none';
  document.getElementById('app-main').style.display = 'none';
  document.getElementById('tournament-join-modal').style.display = 'none';
  // Die Live-Auslosungs-Show ist ein eigenes, bildschirmfüllendes Overlay außerhalb von
  // #app-main - ohne diesen Reset würde sie beim Wechsel mitten aus einer laufenden
  // Auslosung heraus einfach über der Turnierauswahl stehen bleiben.
  if (draftState) draftState.active = false;
  if (groupDraftState) groupDraftState.active = false;
  const draftModal = document.getElementById('draft-modal');
  if (draftModal) draftModal.style.display = 'none';
  renderLandingPage();
  document.getElementById('landing-page').style.display = 'flex';
}
// Einmalige Migration: Wer die App schon vor dem Multi-Turnier-System genutzt hat,
// hatte seine Daten unter dem alten, einzelnen Pfad "tournament" gespeichert. Damit
// dieses Turnier nicht verloren geht, wird es beim allerersten Start unter dem neuen
// System als eigenes Turnier "Mein Turnier" angelegt (die alten Daten bleiben zusätzlich
// unangetastet als Sicherheitskopie liegen). Läuft nur, solange es noch KEIN Turnier
// im neuen System gibt.
function migrateOldTournamentIfNeeded() {
  return db.ref('tournaments_meta').once('value').then((metaSnap) => {
    const meta = metaSnap.val();
    if (meta && Object.keys(meta).length > 0) return null;
    return db.ref('tournament').once('value').then((oldSnap) => {
      const oldData = oldSnap.val();
      if (!oldData || !oldData.players || oldData.players.length === 0) return null;
      const newRef = db.ref('tournaments_meta').push();
      const id = newRef.key;
      return newRef.set({ name: 'Mein Turnier', createdAt: Date.now(), createdBy: 'tim' })
        .then(() => db.ref('tournaments/' + id).set(oldData))
        .then(() => {
          // Bestehenden Login (aus der alten, ungebundenen Speicherung) fürs neue,
          // migrierte Turnier übernehmen, damit man sich nicht neu anmelden muss
          const oldPlayer = localStorage.getItem('fifa_my_player');
          const oldPwv = localStorage.getItem('fifa_my_player_pwv');
          if (oldPlayer) localStorage.setItem('fifa_global_name', oldPlayer);
          if (oldPwv) localStorage.setItem('fifa_my_player_pwv_' + id, oldPwv);
          return id;
        });
    });
  }).catch((error) => {
    console.error('Migrations-Fehler:', error);
    return null;
  });
}
// ============================================================================
// 4c. GOD-PANEL — website-weite Steuerung außerhalb jedes einzelnen Turniers: nur für
//     die Identität "tim" (God) sichtbar. Turniere verwalten, Passwort-Wünsche
//     turnierübergreifend bestätigen, neue Identitäten/Turniere website-weit sperren.
// ============================================================================
// Lädt fortlaufend die website-weite Registry aller bekannten Identitäten (für die
// "Ich bin schon bekannt"-Liste im globalen Identitäts-Modal)
function attachGlobalPlayersListener() {
  db.ref('globalPlayers').on('value', (snap) => {
    globalPlayers = snap.val() || {};
    // Wurde GERADE (während man die Seite schon offen hat) für die eigene Identität ein
    // neues Passwort gesetzt/bestätigt (siehe setPlayerPassword/confirmPendingPassword),
    // stimmt die lokal gemerkte Version nicht mehr überein -> zwingt zur erneuten Anmeldung.
    if (myPlayerName && !isGod()) {
      const gp = getGlobalPlayer(myPlayerName);
      const currentVersion = (gp && gp.passwordVersion) || 0;
      const knownVersion = parseInt(localStorage.getItem(myIdentityPwvStorageKey(myPlayerName)) || '0', 10);
      if (currentVersion > knownVersion) {
        forceIdentityReauth('🔑 Für dein Konto wurde ein neues Passwort gesetzt/bestätigt. Bitte melde dich erneut damit an.');
        return;
      }
    }
    // Passwort-Wünsche stecken jetzt in globalPlayers (nicht mehr in den einzelnen
    // Turnieren) - das God-Panel + sein Hinweis-Badge müssen deshalb bei JEDER Änderung
    // hier neu gerendert werden, nicht nur bei attachGodOversightListener-Updates.
    renderGodPanelButton();
    renderGodPanel();
    // Profil (eigenes oder gerade angesehenes) + Einladungen-Banner live aktuell halten,
    // z.B. wenn währenddessen eine Freundschaftsanfrage oder Einladung eintrifft.
    renderProfile();
    renderInvites();
  }, (error) => {
    console.error('Firebase Lese-Fehler (globalPlayers):', error);
    alert('⚠️ Bekannte Identitäten konnten nicht geladen werden!\n\n' + error.message + '\n\nBitte die Firebase-Datenbankregeln für den Pfad "globalPlayers" prüfen.');
  });
}
// Zwingt zur erneuten Anmeldung der aktuellen Identität (z.B. weil gerade ein neues Passwort
// dafür gesetzt wurde) - schließt alles, zeigt aber direkt die Passwort-Abfrage für denselben
// Namen, statt ganz von vorne zu beginnen.
function forceIdentityReauth(alertMessage) {
  const name = myPlayerName;
  // currentTournamentId bleibt bewusst erhalten (nicht wie bei switchUser()) - nach
  // erfolgreicher Passwort-Eingabe landet man automatisch wieder GENAU in dem Turnier, in
  // dem man gerade war (siehe proceedAfterGlobalIdentity), statt auf der Turnierauswahl.
  if (tournamentRef) { tournamentRef.off('value'); tournamentRef = null; }
  if (godOversightRef) { godOversightRef.off('value'); godOversightRef = null; }
  tournamentEntryHandled = false;
  myPlayerName = null;
  document.getElementById('app-header').style.display = 'none';
  document.getElementById('app-nav').style.display = 'none';
  document.getElementById('app-main').style.display = 'none';
  document.getElementById('landing-page').style.display = 'none';
  document.getElementById('tournament-join-modal').style.display = 'none';
  if (alertMessage) alert(alertMessage);
  document.getElementById('global-identity-modal').style.display = 'flex';
  promptIdentityPassword(name);
}
// Lädt fortlaufend die website-weiten God-Sperren (neue Identitäten / neue Turniere)
function attachGlobalSettingsListener() {
  db.ref('globalSettings').on('value', (snap) => {
    globalSettings = snap.val() || { lockNewIdentities: false, lockNewTournaments: false };
    renderLandingPage();
  }, (error) => {
    console.error('Firebase Lese-Fehler (globalSettings):', error);
    alert('⚠️ Website-weite Sperren konnten nicht geladen werden!\n\n' + error.message + '\n\nBitte die Firebase-Datenbankregeln für den Pfad "globalSettings" prüfen.');
  });
}
// Nur für den God: lädt ALLE Turniere komplett (nicht nur die Meta-Liste), damit er auf
// der Startseite z.B. ausstehende Passwort-Wünsche turnierübergreifend sehen/bestätigen kann.
function attachGodOversightListener() {
  if (godOversightRef) return; // schon aktiv
  godOversightRef = db.ref('tournaments');
  godOversightRef.on('value', (snap) => {
    const all = snap.val() || {};
    godOversightData = {};
    Object.keys(all).forEach((tid) => {
      const t = all[tid] || {};
      const rawPlayers = t.players || [];
      godOversightData[tid] = {
        name: (tournamentsList[tid] && tournamentsList[tid].name) || tid,
        players: rawPlayers.map(p => typeof p === 'string' ? { name: p, isRef: false, password: null } : p)
      };
    });
    renderGodPanel();
    renderGodPanelButton();
  }, (error) => {
    // Läuft typischerweise auf, wenn die Firebase-Regeln das Lesen des KOMPLETTEN
    // "tournaments"-Wurzelpfads verbieten (z.B. wenn nur "tournaments/$id" erlaubt ist) -
    // dann bleibt das God-Panel leer, ohne dass man den Grund sieht. Deshalb hier explizit.
    console.error('Firebase Lese-Fehler (tournaments, God-Übersicht):', error);
    alert('⚠️ God-Panel: Turnierübersicht konnte nicht geladen werden!\n\n' + error.message + '\n\nBitte die Firebase-Datenbankregeln prüfen - der Pfad "tournaments" (nicht nur "tournaments/$id") muss für den God lesbar sein.');
    godOversightRef = null;
  });
}
// Baut das God-Panel auf der Startseite auf: Turniere verwalten, ausstehende
// Passwort-Wünsche (turnierübergreifend) und website-weite Sperren.
function renderGodPanel() {
  const container = document.getElementById('god-panel-container');
  if (!container) return;
  if (!isGod()) { container.innerHTML = ''; return; }
  const pendingKeys = Object.keys(globalPlayers).filter(key => globalPlayers[key] && globalPlayers[key].pendingPassword);
  const playerKeys = Object.keys(globalPlayers).sort((a, b) => (globalPlayers[a].name || a).localeCompare(globalPlayers[b].name || b));
  container.innerHTML = `
    <h2 style="margin-top:0;">👑 God-Panel</h2>
    <p style="font-size:0.85em; opacity:0.8;">
      Nur für dich sichtbar - hier kannst du schon eingreifen, bevor du überhaupt<br>
      ein Turnier betrittst.
    </p>

    <h4 style="margin-bottom:6px;">⏳ Ausstehende Passwort-Wünsche</h4>
    <div style="margin-bottom:16px;">
      ${pendingKeys.length === 0 ? '<p class="empty-state">Aktuell nichts zu bestätigen.</p>' : pendingKeys.map(key => `
        <div style="display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; background: var(--fal-blue-primary); padding: 8px 12px; border-radius: 8px; margin-bottom: 8px; gap: 8px;">
          <div style="font-size:0.9em;">
            <strong>${escapeHtml(globalPlayers[key].name || key)}</strong><br>
            <span style="opacity:0.75; font-size:0.85em;">gilt danach für alle Turniere</span>
          </div>
          <div style="display:flex; gap:5px;">
            <button class="btn-primary btn-sm" style="background:#2ecc71; color:#fff;" onclick="confirmPendingPassword('${key}')">✅ Bestätigen</button>
            <button class="btn-danger btn-sm" onclick="rejectPendingPassword('${key}')">❌ Ablehnen</button>
          </div>
        </div>
      `).join('')}
    </div>

    <h4 style="margin-bottom:6px;">👥 Alle Spieler (website-weit, ${playerKeys.length})</h4>
    <div style="max-height:260px; overflow-y:auto; margin-bottom:16px;">
      ${playerKeys.length === 0 ? '<p class="empty-state">Noch keine Identitäten bekannt.</p>' : playerKeys.map(key => {
        const gp = globalPlayers[key];
        const name = gp.name || key;
        // Sucht in ALLEN Turnieren nach einem Spieler-Eintrag mit diesem Namen, damit man
        // hier auf einen Blick sieht, wo jemand überall mitspielt (und in welcher Rolle).
        const memberships = [];
        Object.keys(godOversightData).forEach((tid) => {
          const t = godOversightData[tid];
          const match = (t.players || []).find(p => p && p.name && p.name.toLowerCase() === name.toLowerCase());
          if (match) {
            const role = match.isTournamentOwner ? 'Admin' : (match.isRef ? 'Ref' : 'Spieler');
            memberships.push(`${escapeHtml(t.name || tid)} (${role})`);
          }
        });
        return `
        <div style="background: var(--fal-blue-primary); padding: 6px 12px; border-radius: 8px; margin-bottom: 6px;">
          <div style="display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:8px;">
            <span style="font-size:0.9em;">${escapeHtml(name)}${key === 'tim' ? ' 👑' : ''}${gp.password ? ' <span style="opacity:0.75;">🔒</span>' : ''}</span>
            <div style="display:flex; gap:5px;">
              ${key === 'tim' ? '' : (gp.password
                ? `<button class="btn-danger btn-sm" onclick="removePlayerPassword('${key}')">PW löschen</button>`
                : `<button class="btn-secondary btn-sm" onclick="setPlayerPassword('${key}')">+ PW</button>`
              )}
              ${key === 'tim' ? '' : `<button class="btn-danger btn-sm" title="Aus der Liste löschen" onclick="deleteGlobalPlayerAsGod('${key}')">🗑️</button>`}
            </div>
          </div>
          ${memberships.length ? `<div style="font-size:0.78em; opacity:0.7; margin-top:3px;">${memberships.join(' · ')}</div>` : '<div style="font-size:0.78em; opacity:0.55; margin-top:3px;">In keinem Turnier registriert</div>'}
        </div>
      `; }).join('')}
    </div>

    <h4 style="margin-bottom:6px;">🔒 Website-weite Sperren</h4>
    <div style="display:flex; flex-direction:column; gap:10px;">
      <label style="display:flex; align-items:flex-start; gap:8px; font-size:0.9em;">
        <input type="checkbox" style="margin-top:3px; flex-shrink:0;" ${globalSettings.lockNewIdentities ? 'checked' : ''} onchange="toggleGlobalLock('lockNewIdentities')">
        <span>Neue Identitäten (unbekannte Namen)<br>sperren - niemand Neues kann sich mehr registrieren</span>
      </label>
      <label style="display:flex; align-items:flex-start; gap:8px; font-size:0.9em;">
        <input type="checkbox" style="margin-top:3px; flex-shrink:0;" ${globalSettings.lockNewTournaments ? 'checked' : ''} onchange="toggleGlobalLock('lockNewTournaments')">
        <span>Neue Turniere erstellen<br>sperren (du als God kannst weiterhin welche anlegen)</span>
      </label>
    </div>
  `;
}
// Löscht ein Turnier komplett (Meta + Daten) - nur der God darf das
function deleteTournamentAsGod(id) {
  if (!isGod()) return;
  const name = (tournamentsList[id] && tournamentsList[id].name) || id;
  if (!confirm(`Turnier "${name}" WIRKLICH unwiderruflich löschen?`)) return;
  db.ref('tournaments_meta/' + id).remove().catch((error) => alert('⚠️ Löschen fehlgeschlagen:\n' + error.message));
  db.ref('tournaments/' + id).remove().catch((error) => alert('⚠️ Löschen fehlgeschlagen:\n' + error.message));
  if (currentTournamentId === id) goToLandingPage();
}
// Benennt ein Turnier um - nur der God darf das
function renameTournamentAsGod(id) {
  if (!isGod()) return;
  const current = (tournamentsList[id] && tournamentsList[id].name) || '';
  const newName = prompt('Neuer Name für dieses Turnier:', current);
  if (newName === null) return;
  if (!newName.trim()) return alert('Name darf nicht leer sein.');
  db.ref('tournaments_meta/' + id + '/name').set(newName.trim()).catch((error) => alert('⚠️ Umbenennen fehlgeschlagen:\n' + error.message));
}
// Schaltet eine website-weite Sperre um (nur God)
function toggleGlobalLock(key) {
  if (!isGod()) return;
  const updated = { ...globalSettings, [key]: !globalSettings[key] };
  db.ref('globalSettings').set(updated).catch((error) => alert('⚠️ Sperre konnte nicht geändert werden:\n' + error.message));
}
// Löscht eine Identität aus der website-weiten Registry (nur God). Bestehende Spieler-
// Einträge in einzelnen Turnieren bleiben davon unberührt - die Person müsste sich unter
// diesem Namen ggf. einfach neu registrieren, falls "Neue Identitäten sperren" aus ist.
function deleteGlobalPlayerAsGod(key) {
  if (!isGod()) return;
  if (key === 'tim') return alert('Du kannst dich nicht selbst aus der Liste löschen.');
  const name = (globalPlayers[key] && globalPlayers[key].name) || key;
  if (!confirm(`Identität "${name}" wirklich aus der Liste löschen?`)) return;
  db.ref('globalPlayers/' + key).remove().catch((error) => alert('⚠️ Löschen fehlgeschlagen:\n' + error.message));
}
// ============================================================================
// 4d. PROFIL-SYSTEM — eigenes Profil (Bio, Foto) bearbeiten, fremde Profile nur ansehen,
//     Freundschaften, Turnier-Einladungen. Alles website-weit in globalPlayers gespeichert,
//     komplett unabhängig vom gerade offenen Turnier (erreichbar schon vor jedem Beitritt).
// ============================================================================
// Öffnet den Profil-Screen. Ohne Namen zeigt er das EIGENE Profil (bearbeitbar), mit Namen
// das Profil eines ANDEREN Spielers (nur ansehen, kein Bearbeiten - siehe renderProfile).
function openProfile(name) {
  if (!myPlayerName) return;
  profileViewKey = name ? name.trim().toLowerCase() : null;
  renderProfile();
  const myKey = myPlayerName.trim().toLowerCase();
  renderProfileStatsSection(profileViewKey || myKey);
  document.getElementById('profile-modal').style.display = 'flex';
}
// Schließt den Profil-Screen wieder, zurück zur Turnierauswahl
function closeProfile() {
  document.getElementById('profile-modal').style.display = 'none';
  profileViewKey = null;
}
// Baut die "Identitätskarte" des Profil-Screens auf: Avatar/Name/Bio/Freunde/Spielersuche -
// eigenes Profil bearbeitbar, fremdes nur lesbar. Läuft bei JEDEM Live-Update aus
// globalPlayers neu (siehe attachGlobalPlayersListener), damit z.B. eine neu eingegangene
// Freundschaftsanfrage sofort sichtbar wird - die Statistiken (renderProfileStatsSection)
// sind bewusst ein SEPARATER Container, der davon unberührt bleibt (kein erneutes Nachladen
// aller Turniere bei jeder Kleinigkeit).
function renderProfile() {
  const container = document.getElementById('profile-identity-container');
  if (!container || !myPlayerName) return;
  const myKey = myPlayerName.trim().toLowerCase();
  const viewingOwn = !profileViewKey || profileViewKey === myKey;
  const key = viewingOwn ? myKey : profileViewKey;
  const gp = globalPlayers[key];
  if (!gp) {
    container.innerHTML = `
      <p style="margin: -6px 0 10px 0; text-align:center;"><a href="#" style="color:var(--fal-yellow); font-size:0.85em; text-decoration:none;" onclick="closeProfile(); return false;">‹ Zurück zur Turnierauswahl</a></p>
      <p class="empty-state">Dieser Spieler wurde nicht gefunden (evtl. gerade gelöscht).</p>
    `;
    return;
  }
  const myGp = globalPlayers[myKey] || {};
  const isFriend = !!(myGp.friends && myGp.friends[key]);
  const requestFromThem = !!(myGp.friendRequests && myGp.friendRequests[key]);
  const requestSentByMe = !!(gp.friendRequests && gp.friendRequests[myKey]);

  let friendActionHtml = '';
  if (!viewingOwn) {
    if (isFriend) {
      friendActionHtml = `<div style="margin-top:6px;"><span style="color:#2ecc71; font-size:0.9em;">✅ Ihr seid befreundet</span><br><button class="btn-danger btn-sm" style="margin-top:6px;" onclick="removeFriend('${key}')">Freundschaft beenden</button></div>`;
    } else if (requestFromThem) {
      friendActionHtml = `<div style="margin-top:6px; display:flex; gap:6px; justify-content:center;"><button class="btn-primary btn-sm" style="background:#2ecc71; color:#fff;" onclick="acceptFriendRequest('${key}')">✅ Anfrage annehmen</button><button class="btn-danger btn-sm" onclick="declineFriendRequest('${key}')">❌ Ablehnen</button></div>`;
    } else if (requestSentByMe) {
      friendActionHtml = `<div style="margin-top:6px;"><span style="opacity:0.75; font-size:0.9em;">⏳ Anfrage gesendet, wartet auf Antwort</span></div>`;
    } else {
      friendActionHtml = `<div style="margin-top:6px;"><button class="btn-secondary btn-sm" onclick="sendFriendRequest('${key}')">🤝 Freundschaftsanfrage senden</button></div>`;
    }
  }

  const avatarHtml = gp.profilePic
    ? `<img src="${gp.profilePic}" style="width:90px; height:90px; border-radius:50%; object-fit:cover; border:2px solid var(--fal-yellow);">`
    : `<div style="width:90px; height:90px; border-radius:50%; background:var(--fal-blue-primary); display:flex; align-items:center; justify-content:center; font-size:2.2em; border:2px solid var(--fal-yellow); margin:0 auto;">👤</div>`;

  let html = `
    <p style="margin: -6px 0 10px 0; text-align:center;">
      ${viewingOwn ? '' : '<a href="#" style="color:var(--fal-yellow); font-size:0.85em; text-decoration:none;" onclick="openProfile(); return false;">‹ Mein Profil</a> · '}
      <a href="#" style="color:var(--fal-yellow); font-size:0.85em; text-decoration:none;" onclick="closeProfile(); return false;">‹ Turnierauswahl</a>
    </p>
    <div style="text-align:center; margin-bottom: 14px;">
      ${avatarHtml}
      <h2 style="margin: 8px 0 2px 0;">${escapeHtml(gp.name || key)}${key === 'tim' ? ' 👑' : ''}</h2>
      ${viewingOwn ? `<button class="btn-secondary btn-sm" onclick="triggerProfilePicUpload()">📷 Profilbild ${gp.profilePic ? 'ändern' : 'hochladen'}</button>` : friendActionHtml}
    </div>
  `;

  if (viewingOwn) {
    html += `
      <h4 style="margin-bottom:6px;">Über mich</h4>
      <textarea id="profile-bio-input" rows="3" placeholder="Erzähl was über dich..." style="width:100%; box-sizing:border-box; padding:8px; margin-bottom:8px;">${escapeHtml(gp.bio || '')}</textarea>
      <button class="btn-primary btn-sm" onclick="saveProfileBio()" style="margin-bottom:18px;">Speichern</button>
    `;
  } else {
    html += `<p style="text-align:center; white-space:pre-wrap; opacity:${gp.bio ? '1' : '0.6'}; margin-bottom:18px;">${gp.bio ? escapeHtml(gp.bio) : 'Noch keine Beschreibung.'}</p>`;
  }

  if (viewingOwn) {
    const requestKeys = Object.keys(gp.friendRequests || {});
    html += `<h4 style="margin-bottom:6px;">⏳ Freundschaftsanfragen (${requestKeys.length})</h4>`;
    html += requestKeys.length === 0 ? '<p class="empty-state">Keine offenen Anfragen.</p>' : requestKeys.map(k => `
      <div style="display:flex; justify-content:space-between; align-items:center; background: var(--fal-blue-primary); padding: 6px 12px; border-radius: 8px; margin-bottom: 6px;">
        <span>${escapeHtml((globalPlayers[k] && globalPlayers[k].name) || k)}</span>
        <div style="display:flex; gap:5px;">
          <button class="btn-primary btn-sm" style="background:#2ecc71; color:#fff;" onclick="acceptFriendRequest('${k}')">✅</button>
          <button class="btn-danger btn-sm" onclick="declineFriendRequest('${k}')">❌</button>
        </div>
      </div>
    `).join('');

    const friendKeys = Object.keys(gp.friends || {});
    html += `<h4 style="margin:14px 0 6px;">🤝 Freunde (${friendKeys.length})</h4>`;
    html += friendKeys.length === 0 ? '<p class="empty-state">Noch keine Freunde.</p>' : friendKeys.map(k => `
      <div style="display:flex; justify-content:space-between; align-items:center; background: var(--fal-blue-primary); padding: 6px 12px; border-radius: 8px; margin-bottom: 6px;">
        <span>${escapeHtml((globalPlayers[k] && globalPlayers[k].name) || k)}</span>
        <button class="btn-secondary btn-sm" onclick="openProfile('${((globalPlayers[k] && globalPlayers[k].name) || k).replace(/'/g, "\\'")}')">Profil ansehen</button>
      </div>
    `).join('');

    html += `<h4 style="margin:14px 0 6px;">👥 Alle Spieler</h4>`;
    html += `<input type="text" id="profile-search-input" placeholder="Spieler suchen..." oninput="renderProfilePlayerList()" style="width:100%; box-sizing:border-box; padding:8px; margin-bottom:8px;">`;
    html += `<div id="profile-player-list-container" style="max-height:220px; overflow-y:auto;"></div>`;
  }

  container.innerHTML = html;
  if (viewingOwn) renderProfilePlayerList();
}
// Baut die durchsuchbare "Alle Spieler"-Liste im eigenen Profil auf
function renderProfilePlayerList() {
  const container = document.getElementById('profile-player-list-container');
  if (!container || !myPlayerName) return;
  const myKey = myPlayerName.trim().toLowerCase();
  const searchInput = document.getElementById('profile-search-input');
  const search = (searchInput ? searchInput.value : '').trim().toLowerCase();
  const keys = Object.keys(globalPlayers)
    .filter(k => k !== myKey && (globalPlayers[k].name || k).toLowerCase().includes(search))
    .sort((a, b) => (globalPlayers[a].name || a).localeCompare(globalPlayers[b].name || b));
  container.innerHTML = keys.length === 0 ? '<p class="empty-state">Keine Spieler gefunden.</p>' : keys.map(k => `
    <div style="display:flex; justify-content:space-between; align-items:center; background: var(--fal-blue-primary); padding: 6px 12px; border-radius: 8px; margin-bottom: 6px;">
      <span>${escapeHtml(globalPlayers[k].name || k)}${k === 'tim' ? ' 👑' : ''}</span>
      <button class="btn-secondary btn-sm" onclick="openProfile('${(globalPlayers[k].name || k).replace(/'/g, "\\'")}')">Profil ansehen</button>
    </div>
  `).join('');
}
// Öffnet die Datei-/Kameraauswahl fürs eigene Profilbild
function triggerProfilePicUpload() {
  if (!myPlayerName) return;
  const input = document.getElementById('profile-pic-file-input');
  if (input) input.click();
}
// Wird aufgerufen, sobald im Datei-Dialog ein Profilbild ausgewählt/fotografiert wurde
function handleProfilePicFileSelected(event) {
  const file = event.target.files && event.target.files[0];
  event.target.value = '';
  if (!file || !myPlayerName) return;
  if (!file.type.startsWith('image/')) return alert('Bitte eine Bilddatei auswählen!');
  resizeImageFile(file, 300, (dataUrl) => {
    const myKey = myPlayerName.trim().toLowerCase();
    db.ref('globalPlayers/' + myKey + '/profilePic').set(dataUrl)
      .catch((error) => alert('⚠️ Foto konnte nicht gespeichert werden:\n' + error.message));
  });
}
// Speichert den "Über mich"-Text der eigenen Identität
function saveProfileBio() {
  if (!myPlayerName) return;
  const textarea = document.getElementById('profile-bio-input');
  const bio = textarea ? textarea.value.trim() : '';
  const myKey = myPlayerName.trim().toLowerCase();
  db.ref('globalPlayers/' + myKey + '/bio').set(bio)
    .catch((error) => alert('⚠️ Konnte nicht gespeichert werden:\n' + error.message));
  alert('✅ Gespeichert.');
}
// Schickt einer anderen Identität eine Freundschaftsanfrage
function sendFriendRequest(targetKey) {
  if (!myPlayerName) return;
  const myKey = myPlayerName.trim().toLowerCase();
  if (targetKey === myKey) return;
  db.ref('globalPlayers/' + targetKey + '/friendRequests/' + myKey).set(true)
    .catch((error) => alert('⚠️ Anfrage konnte nicht gesendet werden:\n' + error.message));
}
// Nimmt eine eingegangene Freundschaftsanfrage an - beide werden gegenseitig als Freunde eingetragen
function acceptFriendRequest(fromKey) {
  if (!myPlayerName) return;
  const myKey = myPlayerName.trim().toLowerCase();
  db.ref('globalPlayers/' + myKey + '/friends/' + fromKey).set(true);
  db.ref('globalPlayers/' + fromKey + '/friends/' + myKey).set(true);
  db.ref('globalPlayers/' + myKey + '/friendRequests/' + fromKey).remove();
}
// Lehnt eine eingegangene Freundschaftsanfrage ab
function declineFriendRequest(fromKey) {
  if (!myPlayerName) return;
  const myKey = myPlayerName.trim().toLowerCase();
  db.ref('globalPlayers/' + myKey + '/friendRequests/' + fromKey).remove();
}
// Beendet eine bestehende Freundschaft (auf beiden Seiten)
function removeFriend(key) {
  if (!myPlayerName) return;
  const myKey = myPlayerName.trim().toLowerCase();
  if (!confirm('Freundschaft wirklich beenden?')) return;
  db.ref('globalPlayers/' + myKey + '/friends/' + key).remove();
  db.ref('globalPlayers/' + key + '/friends/' + myKey).remove();
}
// Baut die Einladungen-Übersicht auf der Turnierauswahl-Startseite auf (siehe renderLandingPage)
function renderInvites() {
  const container = document.getElementById('invites-container');
  if (!container) return;
  if (!myPlayerName) { container.innerHTML = ''; return; }
  const gp = getGlobalPlayer(myPlayerName);
  const invites = (gp && gp.invites) || {};
  // Nur Einladungen zu Turnieren zeigen, die noch existieren (siehe tournamentsList)
  const tids = Object.keys(invites).filter(tid => !!tournamentsList[tid]);
  if (tids.length === 0) { container.innerHTML = ''; return; }
  container.innerHTML = tids.map(tid => `
    <div style="display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; background: var(--fal-blue-primary); padding: 8px 12px; border-radius: 8px; margin-bottom: 8px; gap: 8px;">
      <span style="font-size:0.9em;">🎉 Von <strong>${escapeHtml(invites[tid].invitedBy || '?')}</strong> zu <strong>${escapeHtml((tournamentsList[tid] && tournamentsList[tid].name) || invites[tid].tournamentName || tid)}</strong> eingeladen</span>
      <div style="display:flex; gap:5px;">
        <button class="btn-primary btn-sm" onclick="acceptInvite('${tid}')">➡️ Beitreten</button>
        <button class="btn-secondary btn-sm" onclick="dismissInvite('${tid}')">✕</button>
      </div>
    </div>
  `).join('');
}
// Nimmt eine Turnier-Einladung an - entfernt die Einladung und öffnet direkt das Turnier
function acceptInvite(tid) {
  if (!myPlayerName) return;
  db.ref('globalPlayers/' + myPlayerName.trim().toLowerCase() + '/invites/' + tid).remove();
  enterTournament(tid);
}
// Verwirft eine Turnier-Einladung, ohne beizutreten
function dismissInvite(tid) {
  if (!myPlayerName) return;
  db.ref('globalPlayers/' + myPlayerName.trim().toLowerCase() + '/invites/' + tid).remove();
}
// Baut im Admin-Panel des aktuellen Turniers die Liste bekannter Spieler auf, die noch NICHT
// hier mitspielen, mit Einladen-Knopf (nur Admin/God - siehe renderAdminPanel)
function renderInvitePanel() {
  const container = document.getElementById('invite-player-container');
  if (!container) return;
  if (!isAdmin() || !currentTournamentId) { container.innerHTML = ''; return; }
  const alreadyIn = new Set(players.map(p => p.name.trim().toLowerCase()));
  const candidates = Object.keys(globalPlayers)
    .filter(k => !alreadyIn.has(k))
    .sort((a, b) => (globalPlayers[a].name || a).localeCompare(globalPlayers[b].name || b));
  container.innerHTML = `
    <p style="font-size:0.85em; opacity:0.8;">Lade bekannte Spieler direkt zu diesem Turnier ein - sie sehen die Einladung auf ihrer Turnierauswahl-Seite.</p>
    ${candidates.length === 0 ? '<p class="empty-state">Keine weiteren bekannten Spieler.</p>' : candidates.map(k => {
      const alreadyInvited = !!(globalPlayers[k].invites && globalPlayers[k].invites[currentTournamentId]);
      return `
      <div style="display:flex; justify-content:space-between; align-items:center; background: var(--fal-blue-primary); padding: 6px 12px; border-radius: 8px; margin-bottom: 6px;">
        <span>${escapeHtml(globalPlayers[k].name || k)}</span>
        ${alreadyInvited
          ? '<span style="font-size:0.8em; opacity:0.75;">⏳ Bereits eingeladen</span>'
          : `<button class="btn-secondary btn-sm" onclick="inviteToTournament('${k}')">📨 Einladen</button>`}
      </div>
    `; }).join('')}
  `;
}
// Lädt einen bekannten Spieler zum aktuellen Turnier ein (nur Admin/God)
function inviteToTournament(targetKey) {
  if (!isAdmin() || !currentTournamentId) return;
  const tName = (tournamentsList[currentTournamentId] && tournamentsList[currentTournamentId].name) || '';
  db.ref('globalPlayers/' + targetKey + '/invites/' + currentTournamentId).set({
    tournamentName: tName,
    invitedBy: myPlayerName,
    at: Date.now()
  }).catch((error) => alert('⚠️ Einladung fehlgeschlagen:\n' + error.message));
}
// ============================================================================
// 4e. STATISTIK-ENGINE & RANGLISTE — gemeinsame Datengrundlage für Profil-Statistiken
//     (Turnierhistorie, Rekordsieg/-niederlage, Angst-/Lieblingsgegner) UND die
//     website-weite Elo-Rangliste samt Erfolgen/Badges (siehe openLeaderboard()).
//     Läuft NICHT über einen dauerhaften Live-Listener, sondern lädt bei Bedarf (Profil/
//     Rangliste öffnen) einmalig ALLE Turniere per .once('value') - das reicht für eine
//     kleine Freundesgruppen-Website locker und hält den Rest der App schlank.
// ============================================================================
const ELO_BASE_RATING = 1000; // Start-Elo für jede Identität, bevor sie ein einziges bestätigtes Spiel hatte
// Ordnet KO-Runden einen "Tiefe"-Rang zu, um pro Turnier die am weitesten erreichte Runde
// zu bestimmen (Gruppenphase = 0, ohne eigenen Rundennamen).
const KO_ROUND_DEPTH = { 'Viertelfinale': 1, 'Halbfinale 1': 2, 'Halbfinale 2': 2, '🥉 Spiel um Platz 3': 3, '🏆 FINALE': 4 };
// Ordnet ein Match-Ergebnis ('win'/'loss'/'draw') der passenden Statistik-Eigenschaft zu -
// "loss" pluralisiert unregelmäßig zu "losses" (nicht "losss"), deshalb keine reine
// String-Verkettung wie bei win->wins / draw->draws.
const OUTCOME_STAT_KEY = { win: 'wins', loss: 'losses', draw: 'draws' };
// Baut eine flache, chronologisch sortierte Liste ALLER bestätigten Spiele über ALLE
// übergebenen Turniere hinweg auf (Gruppenphase + KO). "allTournamentsData" ist der rohe
// Inhalt von db.ref('tournaments') (einmalig geladen, siehe loadAllTournamentsData).
function collectAllConfirmedMatches(allTournamentsData, tournamentsMeta) {
  const flat = [];
  Object.keys(allTournamentsData || {}).forEach((tid) => {
    const t = allTournamentsData[tid];
    if (!t || !t.teams) return;
    const tName = (tournamentsMeta[tid] && tournamentsMeta[tid].name) || tid;
    const tCreatedAt = (tournamentsMeta[tid] && tournamentsMeta[tid].createdAt) || 0;
    const teamById = {};
    t.teams.forEach(team => { teamById[team.id] = team; });
    const all = [...(t.groupMatches || []), ...(t.koMatches || [])];
    all.forEach(m => {
      if (!m || !m.confirmed) return;
      if (m.score1 === null || m.score1 === undefined || m.score2 === null || m.score2 === undefined) return;
      const team1 = teamById[m.t1Id], team2 = teamById[m.t2Id];
      // p2 fehlt bei Solo-Teams (Einzel-Modus, ein Spieler pro Team) ganz normal - nur
      // team1/team2 selbst UND jeweils p1 müssen vorhanden sein.
      if (!team1 || !team2 || !team1.p1 || !team2.p1) return;
      flat.push({
        tournamentId: tid, tournamentName: tName,
        round: m.round || null, // null = Gruppenphase
        team1: [team1.p1, team1.p2].filter(Boolean), team2: [team2.p1, team2.p2].filter(Boolean),
        score1: m.score1, score2: m.score2,
        time: m.scheduledTime || tCreatedAt
      });
    });
  });
  flat.sort((a, b) => (a.time || 0) - (b.time || 0));
  return flat;
}
// Lädt einmalig ALLE Turniere komplett (nicht nur die Meta-Liste) für Statistikzwecke und
// ruft callback(allTournamentsData) auf. Kein Live-Listener - wird bei jedem Öffnen von
// Profil-Statistiken bzw. der Rangliste frisch angefragt, damit die Zahlen aktuell bleiben.
function loadAllTournamentsData(callback) {
  db.ref('tournaments').once('value').then((snap) => {
    callback(snap.val() || {});
  }).catch((error) => {
    console.error('Statistik-Laden fehlgeschlagen:', error);
    callback({});
  });
}
// Berechnet aus der flachen Match-Liste die komplette Statistik EINES Spielers: Bilanz,
// Torverhältnis, Rekordsieg/-niederlage, Angst-/Lieblingsgegner sowie eine Übersicht pro
// Turnier (Partner, Bilanz, wie weit gekommen).
function computePlayerStats(playerName, matches) {
  const key = playerName.trim().toLowerCase();
  const stats = {
    totalMatches: 0, wins: 0, losses: 0, draws: 0,
    goalsFor: 0, goalsAgainst: 0,
    biggestWin: null, biggestLoss: null,
    opponentTally: {}, // { gegnerKey: { name, wins, losses, draws } } - aus SICHT dieses Spielers
    tournamentsMap: {}
  };
  matches.forEach(m => {
    const inTeam1 = m.team1.some(p => p.toLowerCase() === key);
    const inTeam2 = m.team2.some(p => p.toLowerCase() === key);
    if (!inTeam1 && !inTeam2) return;
    const myTeam = inTeam1 ? m.team1 : m.team2;
    const oppTeam = inTeam1 ? m.team2 : m.team1;
    const myScore = inTeam1 ? m.score1 : m.score2;
    const oppScore = inTeam1 ? m.score2 : m.score1;
    // Solo-Teams (Einzel-Modus) haben keinen Partner - myTeam enthält dann nur den einen
    // Spieler selbst, .find() liefert also korrekt nichts.
    const partner = myTeam.find(p => p.toLowerCase() !== key) || null;
    const diff = myScore - oppScore;
    // WICHTIG: "loss" pluralisiert unregelmäßig ("losses", nicht "losss") - deshalb über
    // diese Zuordnung statt per outcome+'s' die richtige Statistik-Eigenschaft treffen.
    const outcome = diff > 0 ? 'win' : (diff < 0 ? 'loss' : 'draw');
    const outcomeKey = OUTCOME_STAT_KEY[outcome];

    stats.totalMatches++;
    stats.goalsFor += myScore;
    stats.goalsAgainst += oppScore;
    stats[outcomeKey]++;

    const matchInfo = { tournamentName: m.tournamentName, opponents: oppTeam, partner, myScore, oppScore, diff, round: m.round };
    if (outcome === 'win' && (!stats.biggestWin || diff > stats.biggestWin.diff)) stats.biggestWin = matchInfo;
    if (outcome === 'loss' && (!stats.biggestLoss || diff < stats.biggestLoss.diff)) stats.biggestLoss = matchInfo;

    oppTeam.forEach(oppName => {
      const oKey = oppName.trim().toLowerCase();
      if (!stats.opponentTally[oKey]) stats.opponentTally[oKey] = { name: oppName, wins: 0, losses: 0, draws: 0 };
      stats.opponentTally[oKey][outcomeKey]++;
    });

    if (!stats.tournamentsMap[m.tournamentId]) {
      stats.tournamentsMap[m.tournamentId] = {
        tournamentName: m.tournamentName, partners: new Set(),
        played: 0, wins: 0, losses: 0, draws: 0,
        deepestRoundDepth: 0, deepestRound: null, reachedFinal: false, wonFinal: false,
        playedThirdPlace: false, wonThirdPlace: false
      };
    }
    const tEntry = stats.tournamentsMap[m.tournamentId];
    if (partner) tEntry.partners.add(partner);
    tEntry.played++;
    tEntry[outcomeKey]++;
    if (m.round) {
      // Neuere Turniere (mit generischer KO-Phase, siehe advanceKORound) tragen die
      // Runden-Tiefe direkt als roundNumber mit - zuverlässiger als der Rundenname, der
      // jetzt beliebig sein kann (Achtelfinale, Sechzehntelfinale, "Runde der N", ...).
      // Ältere, bereits abgeschlossene Turniere ohne roundNumber fallen auf die feste
      // Namenstabelle zurück, damit ihre Statistik-Historie unverändert bleibt.
      const depth = (m.roundNumber !== undefined && m.roundNumber !== null) ? m.roundNumber + 1 : (KO_ROUND_DEPTH[m.round] || 0);
      if (depth > tEntry.deepestRoundDepth) { tEntry.deepestRoundDepth = depth; tEntry.deepestRound = m.round; }
      if (m.round === '🏆 FINALE') { tEntry.reachedFinal = true; tEntry.wonFinal = outcome === 'win'; }
      if (m.round === '🥉 Spiel um Platz 3') { tEntry.playedThirdPlace = true; tEntry.wonThirdPlace = outcome === 'win'; }
    }
  });

  // Nemesis: Gegner, der am häufigsten gegen diesen Spieler gewonnen hat (mind. 2 Begegnungen).
  // Lieblingsgegner: Gegner, gegen den dieser Spieler am häufigsten gewonnen hat.
  const opponents = Object.values(stats.opponentTally);
  stats.nemesis = opponents.filter(o => o.losses >= 2)
    .sort((a, b) => b.losses - a.losses || (a.wins - a.losses) - (b.wins - b.losses))[0] || null;
  stats.favoriteVictim = opponents.filter(o => o.wins >= 2)
    .sort((a, b) => b.wins - a.wins || (b.wins - b.losses) - (a.wins - a.losses))[0] || null;

  stats.tournaments = Object.keys(stats.tournamentsMap).map(tid => {
    const e = stats.tournamentsMap[tid];
    let placement;
    if (e.wonFinal) placement = '🏆 Turniersieger';
    else if (e.reachedFinal) placement = '🥈 Finalist';
    else if (e.playedThirdPlace) placement = e.wonThirdPlace ? '🥉 3. Platz' : '4. Platz';
    else if (e.deepestRound) placement = `${e.deepestRound} erreicht`;
    else placement = 'Gruppenphase';
    return {
      tournamentId: tid, tournamentName: e.tournamentName, partners: Array.from(e.partners),
      played: e.played, wins: e.wins, losses: e.losses, draws: e.draws, placement
    };
  });

  stats.winRate = stats.totalMatches > 0 ? Math.round((stats.wins / stats.totalMatches) * 100) : 0;
  stats.goalDiff = stats.goalsFor - stats.goalsAgainst;
  return stats;
}
// Spielt ALLE Spiele einer flachen, chronologisch sortierten Match-Liste durch und berechnet
// daraus eine Elo-Wertung PRO SPIELER (Team-Elo = Mittelwert der Team-Mitglieder, die dann
// alle dieselbe Änderung gutgeschrieben/abgezogen bekommen). Funktioniert für 2er-Teams
// (Duo-Modus) GENAUSO wie für Solo-Teams (Einzel-Modus, ein Spieler = ein Team - dann ist
// die "Team-Wertung" einfach die eigene). Der K-Faktor sinkt mit steigender Erfahrung
// (unsichere Anfangswertung schwankt stärker, etablierte weniger) - dasselbe Prinzip wie bei
// echten Elo-Systemen (Schach, viele E-Sports-Ranglisten).
function computeGlobalRatings(matches) {
  const ratings = {};
  function ensure(name) {
    const key = name.trim().toLowerCase();
    if (!ratings[key]) {
      ratings[key] = { name, key, rating: ELO_BASE_RATING, games: 0, wins: 0, losses: 0, draws: 0, streak: 0, bestStreak: 0 };
    }
    return ratings[key];
  }
  function kFactor(p) { return p.games < 10 ? 40 : (p.games < 30 ? 24 : 16); }
  matches.forEach(m => {
    const teamA = m.team1.map(ensure);
    const teamB = m.team2.map(ensure);
    if (teamA.length === 0 || teamB.length === 0) return;
    const teamARating = teamA.reduce((sum, p) => sum + p.rating, 0) / teamA.length;
    const teamBRating = teamB.reduce((sum, p) => sum + p.rating, 0) / teamB.length;
    const expectedA = 1 / (1 + Math.pow(10, (teamBRating - teamARating) / 400));
    const scoreA = m.score1 > m.score2 ? 1 : (m.score1 < m.score2 ? 0 : 0.5);
    const applyResult = (player, own, opp) => {
      const delta = Math.round(kFactor(player) * (own - opp));
      player.rating += delta;
      player.games++;
      if (own === 1) { player.wins++; player.streak = player.streak > 0 ? player.streak + 1 : 1; }
      else if (own === 0) { player.losses++; player.streak = player.streak < 0 ? player.streak - 1 : -1; }
      else { player.draws++; player.streak = 0; }
      if (player.streak > player.bestStreak) player.bestStreak = player.streak;
    };
    teamA.forEach(p => applyResult(p, scoreA, expectedA));
    teamB.forEach(p => applyResult(p, 1 - scoreA, 1 - expectedA));
  });
  return ratings;
}
// Leitet aus Statistik + Elo-Wertung eine kleine Auswahl an Erfolgs-Badges für EINEN
// Spieler ab - rein anzeigend, ohne Einfluss auf irgendwelche Rechte.
function computeAchievements(playerKey, stats, ratingEntry, allRatings) {
  const badges = [];
  const tournamentWins = stats.tournaments.filter(t => t.placement === '🏆 Turniersieger').length;
  if (tournamentWins >= 1) badges.push({ icon: '🏆', label: tournamentWins === 1 ? 'Turniersieger' : `${tournamentWins}x Turniersieger` });
  if (tournamentWins >= 3) badges.push({ icon: '👑', label: 'Serien-Champion' });
  if (stats.totalMatches >= 50) badges.push({ icon: '⚔️', label: 'Gladiator (50+ Spiele)' });
  if (ratingEntry && ratingEntry.bestStreak >= 5) badges.push({ icon: '🔥', label: `${ratingEntry.bestStreak}er-Siegesserie` });
  if (stats.totalMatches >= 10 && stats.winRate >= 70) badges.push({ icon: '🎯', label: 'Scharfschütze (70%+ Siegquote)' });
  if (stats.nemesis && stats.nemesis.losses >= 3) badges.push({ icon: '😈', label: `Angst vor ${stats.nemesis.name}` });
  const sortedByRating = Object.keys(allRatings).sort((a, b) => allRatings[b].rating - allRatings[a].rating);
  if (sortedByRating.length > 0 && sortedByRating[0] === playerKey && allRatings[playerKey].games > 0) {
    badges.push({ icon: '🐐', label: 'Aktuell Nr. 1 der Rangliste' });
  }
  return badges;
}
// Ermittelt die direkte Bilanz zweier Spieler gegeneinander (nur Spiele, in denen sie auf
// GEGNERISCHEN Teams standen) aus der bereits gesammelten Match-Liste (siehe
// collectAllConfirmedMatches) - inkl. größtem Sieg für jede Seite und aktueller Serie.
function computeHeadToHead(nameA, nameB, matches) {
  const keyA = nameA.trim().toLowerCase();
  const keyB = nameB.trim().toLowerCase();
  const result = { winsA: 0, winsB: 0, draws: 0, games: [], biggestA: null, biggestB: null, displayA: nameA, displayB: nameB };
  matches.forEach(m => {
    const aInTeam1 = m.team1.some(n => n.toLowerCase() === keyA);
    const aInTeam2 = m.team2.some(n => n.toLowerCase() === keyA);
    const bInTeam1 = m.team1.some(n => n.toLowerCase() === keyB);
    const bInTeam2 = m.team2.some(n => n.toLowerCase() === keyB);
    if (!((aInTeam1 && bInTeam2) || (aInTeam2 && bInTeam1))) return;
    const aIsTeam1 = aInTeam1;
    const scoreA = aIsTeam1 ? m.score1 : m.score2;
    const scoreB = aIsTeam1 ? m.score2 : m.score1;
    // Echte Namensschreibweise aus den tatsächlichen Match-Daten übernehmen (statt der evtl.
    // anders großgeschriebenen Eingabe), damit die Anzeige immer korrekt aussieht.
    result.displayA = (aIsTeam1 ? m.team1 : m.team2).find(n => n.toLowerCase() === keyA) || nameA;
    result.displayB = (aIsTeam1 ? m.team2 : m.team1).find(n => n.toLowerCase() === keyB) || nameB;
    const diff = scoreA - scoreB;
    let outcome;
    if (diff > 0) { result.winsA++; outcome = 'A'; if (!result.biggestA || diff > result.biggestA.diff) result.biggestA = { scoreA, scoreB, diff, tournamentName: m.tournamentName }; }
    else if (diff < 0) { result.winsB++; outcome = 'B'; if (!result.biggestB || -diff > result.biggestB.diff) result.biggestB = { scoreA, scoreB, diff: -diff, tournamentName: m.tournamentName }; }
    else { result.draws++; outcome = 'draw'; }
    result.games.push({ scoreA, scoreB, outcome, tournamentName: m.tournamentName, round: m.round, time: m.time });
  });
  result.games.sort((a, b) => (b.time || 0) - (a.time || 0));
  // Aktuelle Serie: wie viele der letzten Spiele in Folge dieselbe Seite gewonnen hat
  let streakOutcome = null, streakCount = 0;
  for (const g of result.games) {
    if (g.outcome === 'draw') break;
    if (streakOutcome === null) { streakOutcome = g.outcome; streakCount = 1; }
    else if (g.outcome === streakOutcome) streakCount++;
    else break;
  }
  result.streak = streakCount > 0 ? { outcome: streakOutcome, count: streakCount } : null;
  return result;
}
// Baut das HTML für die Kopf-an-Kopf-Bilanz zwischen dem eigenen Profil und dem gerade
// angesehenen fremden Profil auf (siehe computeHeadToHead)
function renderHeadToHeadHtml(h2h) {
  const total = h2h.winsA + h2h.winsB + h2h.draws;
  if (total === 0) {
    return `<hr style="margin:16px 0; opacity:0.3;"><h4 style="margin-bottom:6px;">⚔️ Kopf-an-Kopf gegen ${escapeHtml(h2h.displayB)}</h4><p class="empty-state">Ihr wart in noch keinem bestätigten Spiel direkte Gegner.</p>`;
  }
  const streakText = h2h.streak
    ? (h2h.streak.outcome === 'A' ? `🔥 ${h2h.streak.count}x in Folge gegen ${escapeHtml(h2h.displayB)} gewonnen` : `❄️ ${h2h.streak.count}x in Folge gegen ${escapeHtml(h2h.displayB)} verloren`)
    : '';
  return `
    <hr style="margin:16px 0; opacity:0.3;">
    <h4 style="margin-bottom:6px;">⚔️ Kopf-an-Kopf gegen ${escapeHtml(h2h.displayB)}</h4>
    <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; text-align:center; margin-bottom:10px;">
      <div style="background:var(--fal-blue-primary); border-radius:8px; padding:8px;">
        <div style="font-size:1.3em; font-weight:bold; color:#2ecc71;">${h2h.winsA}</div>
        <div style="font-size:0.75em; opacity:0.75;">Deine Siege</div>
      </div>
      <div style="background:var(--fal-blue-primary); border-radius:8px; padding:8px;">
        <div style="font-size:1.3em; font-weight:bold; opacity:0.8;">${h2h.draws}</div>
        <div style="font-size:0.75em; opacity:0.75;">Unentschieden</div>
      </div>
      <div style="background:var(--fal-blue-primary); border-radius:8px; padding:8px;">
        <div style="font-size:1.3em; font-weight:bold; color:var(--fal-red);">${h2h.winsB}</div>
        <div style="font-size:0.75em; opacity:0.75;">Siege ${escapeHtml(h2h.displayB)}</div>
      </div>
    </div>
    ${streakText ? `<p style="font-size:0.9em; margin-bottom:8px;">${streakText}</p>` : ''}
    ${h2h.biggestA ? `<p style="font-size:0.85em; opacity:0.85; margin:2px 0;">Höchster Sieg: <strong>${h2h.biggestA.scoreA}:${h2h.biggestA.scoreB}</strong> (${escapeHtml(h2h.biggestA.tournamentName)})</p>` : ''}
    ${h2h.biggestB ? `<p style="font-size:0.85em; opacity:0.85; margin:2px 0;">Höchste Niederlage: <strong>${h2h.biggestB.scoreA}:${h2h.biggestB.scoreB}</strong> (${escapeHtml(h2h.biggestB.tournamentName)})</p>` : ''}
    <details style="margin-top:8px;">
      <summary style="cursor:pointer; font-size:0.85em; opacity:0.8;">Alle ${total} direkten Duelle anzeigen</summary>
      <div style="margin-top:6px;">
        ${h2h.games.map(g => `
          <div style="display:flex; justify-content:space-between; background:rgba(0,0,0,0.2); padding:5px 10px; border-radius:6px; margin-bottom:4px; font-size:0.85em;">
            <span>${escapeHtml(g.tournamentName)}${g.round ? ` · ${escapeHtml(g.round)}` : ''}</span>
            <strong style="color:${g.outcome === 'A' ? '#2ecc71' : (g.outcome === 'B' ? 'var(--fal-red)' : 'inherit')};">${g.scoreA}:${g.scoreB}</strong>
          </div>
        `).join('')}
      </div>
    </details>
  `;
}
// Lädt (asynchron) alle Turniere und rendert daraus den Statistik-Abschnitt EINES Profils -
// bewusst getrennt von renderProfile(), damit Live-Updates der Identitätskarte (Bio,
// Freunde) nicht jedes Mal alle Turniere neu nachladen müssen.
function renderProfileStatsSection(key) {
  const container = document.getElementById('profile-stats-container');
  if (!container) return;
  container.innerHTML = '<p class="empty-state">📊 Statistiken werden geladen...</p>';
  loadAllTournamentsData((allData) => {
    // Zwischenzeitlich könnte das Profil gewechselt oder geschlossen worden sein
    const stillRelevant = document.getElementById('profile-modal').style.display !== 'none' &&
      ((profileViewKey || (myPlayerName && myPlayerName.trim().toLowerCase())) === key);
    if (!stillRelevant) return;
    const matches = collectAllConfirmedMatches(allData, tournamentsList);
    const stats = computePlayerStats(key, matches);
    const ratings = computeGlobalRatings(matches);
    const ratingEntry = ratings[key];
    const badges = computeAchievements(key, stats, ratingEntry, ratings);
    let html = renderStatsHtml(stats, ratingEntry, ratings, badges);
    // Kopf-an-Kopf-Bilanz nur beim Ansehen eines FREMDEN Profils (nicht des eigenen) -
    // nutzt dieselben schon geladenen Match-Daten, kein zusätzlicher Netzwerk-Roundtrip.
    const myKey = myPlayerName ? myPlayerName.trim().toLowerCase() : null;
    if (myKey && myKey !== key) {
      html += renderHeadToHeadHtml(computeHeadToHead(myPlayerName, key, matches));
    }
    container.innerHTML = html;
  });
}
// Baut das HTML für den Statistik-Abschnitt eines Profils auf
function renderStatsHtml(stats, ratingEntry, allRatings, badges) {
  if (stats.totalMatches === 0) {
    return '<hr style="margin:16px 0; opacity:0.3;"><p class="empty-state">Noch keine bestätigten Spiele - hier stehen bald Statistiken.</p>';
  }
  const sortedByRating = Object.keys(allRatings).sort((a, b) => allRatings[b].rating - allRatings[a].rating);
  const rank = ratingEntry ? sortedByRating.indexOf(ratingEntry.key) + 1 : null;

  let html = '<hr style="margin:16px 0; opacity:0.3;">';
  html += '<h4 style="margin-bottom:6px;">📊 Statistiken</h4>';

  if (badges.length > 0) {
    html += `<div style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:12px;">
      ${badges.map(b => `<span title="${escapeHtml(b.label)}" style="background:var(--fal-blue-primary); border-radius:20px; padding:4px 10px; font-size:0.85em;">${b.icon} ${escapeHtml(b.label)}</span>`).join('')}
    </div>`;
  }

  html += `
    <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; text-align:center; margin-bottom:14px;">
      <div style="background:var(--fal-blue-primary); border-radius:8px; padding:8px;">
        <div style="font-size:1.3em; font-weight:bold; color:var(--fal-yellow);">${ratingEntry ? ratingEntry.rating : ELO_BASE_RATING}</div>
        <div style="font-size:0.75em; opacity:0.75;">Elo${rank ? ` (Platz ${rank})` : ''}</div>
      </div>
      <div style="background:var(--fal-blue-primary); border-radius:8px; padding:8px;">
        <div style="font-size:1.3em; font-weight:bold;">${stats.wins}-${stats.draws}-${stats.losses}</div>
        <div style="font-size:0.75em; opacity:0.75;">Siege-Remis-Niederl.</div>
      </div>
      <div style="background:var(--fal-blue-primary); border-radius:8px; padding:8px;">
        <div style="font-size:1.3em; font-weight:bold;">${stats.winRate}%</div>
        <div style="font-size:0.75em; opacity:0.75;">Siegquote</div>
      </div>
    </div>
    <p style="font-size:0.85em; opacity:0.8; margin-bottom:12px;">⚽ Tore: ${stats.goalsFor}:${stats.goalsAgainst} (${stats.goalDiff >= 0 ? '+' : ''}${stats.goalDiff})</p>
  `;

  if (stats.biggestWin) {
    html += `<p style="font-size:0.85em; margin-bottom:4px;">🥇 <strong>Höchster Sieg:</strong> ${stats.biggestWin.myScore}:${stats.biggestWin.oppScore} gegen ${escapeHtml(stats.biggestWin.opponents.join(' & '))} <span style="opacity:0.7;">(${escapeHtml(stats.biggestWin.tournamentName)})</span></p>`;
  }
  if (stats.biggestLoss) {
    html += `<p style="font-size:0.85em; margin-bottom:4px;">💀 <strong>Höchste Niederlage:</strong> ${stats.biggestLoss.myScore}:${stats.biggestLoss.oppScore} gegen ${escapeHtml(stats.biggestLoss.opponents.join(' & '))} <span style="opacity:0.7;">(${escapeHtml(stats.biggestLoss.tournamentName)})</span></p>`;
  }
  if (stats.nemesis) {
    html += `<p style="font-size:0.85em; margin-bottom:4px;">😈 <strong>Angstgegner:</strong> ${escapeHtml(stats.nemesis.name)} (${stats.nemesis.wins}S-${stats.nemesis.losses}N gegen ihn/sie)</p>`;
  }
  if (stats.favoriteVictim) {
    html += `<p style="font-size:0.85em; margin-bottom:12px;">🎯 <strong>Lieblingsgegner:</strong> ${escapeHtml(stats.favoriteVictim.name)} (${stats.favoriteVictim.wins}S-${stats.favoriteVictim.losses}N gegen ihn/sie)</p>`;
  }

  html += `<h4 style="margin:14px 0 6px;">🏆 Turnierhistorie (${stats.tournaments.length})</h4>`;
  html += stats.tournaments.map(t => `
    <div style="background:var(--fal-blue-primary); padding:8px 12px; border-radius:8px; margin-bottom:6px; font-size:0.85em;">
      <strong>${escapeHtml(t.tournamentName)}</strong> - ${t.placement}<br>
      <span style="opacity:0.75;">${t.partners.length ? `mit ${escapeHtml(t.partners.join(' & '))} · ` : ''}${t.wins}S-${t.draws}R-${t.losses}N</span>
    </div>
  `).join('');

  return html;
}
// Öffnet die website-weite Rangliste (Elo, über alle Turniere hinweg)
function openLeaderboard() {
  if (!myPlayerName) return;
  document.getElementById('leaderboard-modal').style.display = 'flex';
  document.getElementById('leaderboard-container').innerHTML = '<p class="empty-state">📊 Rangliste wird geladen...</p>';
  loadAllTournamentsData((allData) => {
    if (document.getElementById('leaderboard-modal').style.display === 'none') return;
    const matches = collectAllConfirmedMatches(allData, tournamentsList);
    const ratings = computeGlobalRatings(matches);
    renderLeaderboard(ratings);
  });
}
function closeLeaderboard() {
  document.getElementById('leaderboard-modal').style.display = 'none';
}
// Baut die Ranglisten-Tabelle auf - Klick auf einen Namen öffnet dessen Profil (mit Statistiken)
function renderLeaderboard(ratings) {
  const container = document.getElementById('leaderboard-container');
  if (!container) return;
  const entries = Object.values(ratings).filter(r => r.games > 0).sort((a, b) => b.rating - a.rating);
  if (entries.length === 0) {
    container.innerHTML = '<h2 style="margin-top:0;">🏆 Rangliste</h2><p class="empty-state">Noch keine bestätigten Spiele über alle Turniere hinweg - die Rangliste füllt sich, sobald gespielt wurde.</p>';
    return;
  }
  container.innerHTML = `
    <h2 style="margin-top:0;">🏆 Rangliste</h2>
    <p style="font-size:0.85em; opacity:0.8; margin-bottom:12px;">Elo-Wertung über ALLE Turniere hinweg - jeder Sieg/jede Niederlage zählt, unabhängig davon, mit wem man gerade gespielt hat.</p>
    ${entries.map((r, i) => {
      const medal = i === 0 ? '🥇' : (i === 1 ? '🥈' : (i === 2 ? '🥉' : `${i + 1}.`));
      const streakLabel = r.streak >= 3 ? ` 🔥${r.streak}` : (r.streak <= -3 ? ` ❄️${Math.abs(r.streak)}` : '');
      return `
      <div style="display:flex; justify-content:space-between; align-items:center; background: var(--fal-blue-primary); padding: 8px 12px; border-radius: 8px; margin-bottom: 6px; cursor:pointer;" onclick="closeLeaderboard(); openProfile('${r.name.replace(/'/g, "\\'")}')">
        <span><strong>${medal}</strong> ${escapeHtml(r.name)}${r.key === 'tim' ? ' 👑' : ''}${streakLabel}</span>
        <span style="text-align:right;">
          <strong style="color:var(--fal-yellow);">${r.rating}</strong>
          <span style="font-size:0.8em; opacity:0.7;"> · ${r.wins}S-${r.draws}R-${r.losses}N</span>
        </span>
      </div>
    `; }).join('')}
  `;
}
// ============================================================================
// 5. PROFI-CLUBS VERWALTUNG — Liste der Vereine, aus denen beim Glücksrad gezogen wird
// ============================================================================
function addClub() {
  if (!hasElevated()) return;
  const input = document.getElementById('new-club-name');
  const name = input ? input.value.trim() : '';
  if (!name) return;
  if (availableClubs.includes(name)) return alert('Club bereits in der Liste!');
  availableClubs.push(name);
  input.value = '';
  saveData();
}
// Entfernt einen Club aus der Liste der verfügbaren Profi-Vereine
function removeClub(index) {
  if (!hasElevated()) return;
  availableClubs.splice(index, 1);
  saveData();
}
// Setzt die Club-Liste auf die Standard-Topteams (DEFAULT_CLUBS) zurück
function resetClubsToDefault() {
  if (!hasElevated()) return;
  if (confirm('Verfügbare Clubs auf Standard-Topteams zurücksetzen? (Stellt auch deren Standard-Wappen wieder her)')) {
    availableClubs = [...DEFAULT_CLUBS];
    clubLogos = { ...clubLogos, ...DEFAULT_CLUB_LOGOS };
    saveData();
  }
}
// Fügt eine neue Cheat-Vorauswahl hinzu: zwei Spieler, die garantiert ins selbe
// Team kommen, optional mit festem Club. NUR für den echten Admin (nicht Ref) -
// das ist bewusst geheim und soll nicht jeder mit erweiterten Rechten nutzen können.
function addDraftCheat() {
  if (!isGod()) return;
  const solo = tournamentMode === 'solo';
  const p1Sel = document.getElementById('cheat-p1-select');
  const p2Sel = solo ? null : document.getElementById('cheat-p2-select');
  const clubSel = document.getElementById('cheat-club-select');
  const p1 = p1Sel ? p1Sel.value : '';
  const p2 = p2Sel ? p2Sel.value : '';
  const club = clubSel ? clubSel.value : '';
  if (!p1) return alert('Bitte mindestens einen Spieler auswählen!');
  if (p2 && p2 === p1) return alert('Bitte zwei unterschiedliche Spieler auswählen (oder den 2. auf "egal" lassen)!');
  if (!p2 && !club) return alert(solo ? 'Bitte einen Verein festlegen, sonst bewirkt die Vorgabe nichts!' : 'Ohne festgelegten Partner brauchst du mindestens einen festgelegten Verein, sonst bewirkt die Vorgabe nichts!');
  draftCheats.push({ p1, p2: p2 || null, club: club || null });
  saveData();
  renderAll();
}
// Entfernt eine Vorgabe wieder
function removeDraftCheat(index) {
  if (!isGod()) return;
  draftCheats.splice(index, 1);
  saveData();
  renderAll();
}
// Baut die Auslosungs-Vorgaben-UI im Admin-Panel auf (Formular + Liste). Nur der echte
// Admin sieht das überhaupt, und auch nur, solange noch keine Teams gelost wurden -
// danach sind Vorgaben ohnehin hinfällig und die Box verschwindet automatisch wieder.
function renderDraftCheatPanel() {
  const container = document.getElementById('draft-cheat-container');
  if (!container) return;
  if (!isGod() || teams.length > 0 || tournamentSport === 'darts') { container.innerHTML = ''; return; }
  const solo = tournamentMode === 'solo';
  const usedNames = new Set();
  draftCheats.forEach(c => { usedNames.add(c.p1); if (c.p2) usedNames.add(c.p2); });
  const availablePlayers = players.filter(p => !usedNames.has(p.name));
  const playerOptions = availablePlayers.map(p => `<option value="${escapeHtml(p.name)}">${escapeHtml(p.name)}</option>`).join('');
  const partnerOptions = '<option value="">(Partner egal)</option>' + playerOptions;
  const clubOptions = '<option value="">(Verein zufällig)</option>' + availableClubs.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('');
  const list = draftCheats.length ? draftCheats.map((c, i) => `
    <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.25); padding:6px 10px; border-radius:6px; margin-bottom:4px; font-size:0.85em;">
      <span><strong>${escapeHtml(c.p1)}</strong>${!solo ? (c.p2 ? ` &amp; <strong>${escapeHtml(c.p2)}</strong>` : ' (Partner egal)') : ''}${c.club ? ` → ${escapeHtml(c.club)}` : ' (Verein zufällig)'}</span>
      <span style="cursor:pointer; color:#ff4d4d; font-weight:bold;" onclick="removeDraftCheat(${i})">×</span>
    </div>
  `).join('') : '<p style="font-size:0.85em; opacity:0.7; margin:0 0 8px 0;">Noch keine Vorgaben - alles bleibt komplett zufällig.</p>';

  container.innerHTML = `
    <div style="margin-top:14px; padding-top:12px; border-top:1px solid rgba(255,255,255,0.1);">
      <p style="font-size:0.9em; font-weight:bold; margin:0 0 4px 0;">⚙️ Auslosungs-Voreinstellungen (optional)</p>
      <p style="font-size:0.8em; opacity:0.75; margin:0 0 8px 0;">${solo
        ? 'Hier kannst du vor der Auslosung festlegen, welcher Spieler welchen Verein bekommt. Ohne Vorgabe bleibt alles zufällig.'
        : 'Hier kannst du vor der Auslosung festlegen, welcher Spieler mit wem zusammen ins Team soll und/oder welchen Verein er bekommt. Den Partner kannst du auch offen lassen ("egal") und nur den Verein festlegen. Ohne Vorgabe bleibt alles zufällig.'}</p>
      ${list}
      ${availablePlayers.length >= 1 ? `
        <div style="display:flex; gap:6px; flex-wrap:wrap; margin-top:4px;">
          <select id="cheat-p1-select">${playerOptions}</select>
          ${solo ? '' : `<select id="cheat-p2-select">${partnerOptions}</select>`}
          <select id="cheat-club-select">${clubOptions}</select>
          <button class="btn-secondary btn-sm" onclick="addDraftCheat()">+ Hinzufügen</button>
        </div>
      ` : ''}
    </div>
  `;
}
// Liefert alle Voreinstellungen, die noch NICHT eingelöst wurden - deren Spieler also
// (laut übergebener Restliste) noch nicht in ein Team gelost wurden. Wird gebraucht, damit
// ihr Wunsch-Partner/-Verein bei ZUFÄLLIGEN Ziehungen für ANDERE, unbeteiligte Teams
// geschützt bleibt. Sonst könnte der Wunsch-Partner oder -Verein schon in einer früheren
// Runde für ein völlig fremdes Team weggezogen werden, bevor der eigentliche Spieler
// überhaupt an der Reihe war - genau das war der gemeldete Bug.
function getPendingDraftCheats(remainingPlayerNames) {
  return draftCheats.filter(c =>
    remainingPlayerNames.includes(c.p1) && (!c.p2 || remainingPlayerNames.includes(c.p2))
  );
}
// Zieht zufällig einen Index aus "pool", vermeidet dabei aber nach Möglichkeit Einträge,
// die in "reserved" stehen (siehe getPendingDraftCheats). Bleiben dadurch KEINE Kandidaten
// mehr übrig (z.B. weil ausnahmsweise nur noch reservierte Einträge da sind), wird trotzdem
// aus dem vollen Pool gezogen - irgendwer/irgendwas muss ja an der Reihe sein.
function pickRandomIndexAvoidingReserved(pool, reserved) {
  const free = [];
  pool.forEach((item, i) => { if (!reserved.has(item)) free.push(i); });
  const candidates = free.length > 0 ? free : pool.map((_, i) => i);
  return candidates[Math.floor(Math.random() * candidates.length)];
}
// Simuliert die komplette Team-Auslosung "im Kopf" (ohne Glücksrad-Show/Animation) nach
// exakt denselben Regeln wie die Live-Show inkl. Voreinstellungen - für quickDrawTeams().
function simulateTeamDraw(playerNames, clubNames) {
  const remainingPlayers = [...playerNames];
  const remainingClubs = [...clubNames];
  const resultTeams = [];
  while (remainingPlayers.length >= 2) {
    // Spieler 1 bleibt ehrlich zufällig (identisch zur Live-Show)
    const p1Index = Math.floor(Math.random() * remainingPlayers.length);
    const p1 = remainingPlayers.splice(p1Index, 1)[0];
    // Partner: erst schauen, ob eine Vorgabe für p1 existiert, sonst zufällig (reserviert-bewusst)
    const partnerCheat = draftCheats.find(c => c.p2 && (c.p1 === p1 || c.p2 === p1));
    let p2Index = partnerCheat ? remainingPlayers.indexOf(partnerCheat.p1 === p1 ? partnerCheat.p2 : partnerCheat.p1) : -1;
    if (p2Index === -1) {
      const reservedPlayers = new Set();
      getPendingDraftCheats(remainingPlayers).forEach(c => { if (c.p2) { reservedPlayers.add(c.p1); reservedPlayers.add(c.p2); } });
      p2Index = pickRandomIndexAvoidingReserved(remainingPlayers, reservedPlayers);
    }
    const p2 = remainingPlayers.splice(p2Index, 1)[0];
    // Verein: erst schauen, ob eine Vorgabe für dieses Duo existiert, sonst zufällig (reserviert-bewusst)
    const clubCheat = draftCheats.find(c => {
      if (!c.club) return false;
      if (c.p2) return (c.p1 === p1 && c.p2 === p2) || (c.p1 === p2 && c.p2 === p1);
      return c.p1 === p1 || c.p1 === p2;
    });
    let clubIndex = clubCheat ? remainingClubs.indexOf(clubCheat.club) : -1;
    if (clubIndex === -1) {
      const reservedClubs = new Set();
      getPendingDraftCheats(remainingPlayers).forEach(c => { if (c.club) reservedClubs.add(c.club); });
      clubIndex = pickRandomIndexAvoidingReserved(remainingClubs, reservedClubs);
    }
    const club = remainingClubs.splice(clubIndex, 1)[0];
    resultTeams.push({ id: resultTeams.length + 1, name: `Team ${resultTeams.length + 1}`, p1, p2, club });
  }
  return resultTeams;
}
// Simuliert die Auslosung im EINZEL-Modus: jeder Spieler bekommt seinen eigenen Verein,
// kein Partner. Respektiert Club-Vorgaben (p2 spielt dabei keine Rolle) genauso
// reserviert-bewusst wie simulateTeamDraw() - siehe getPendingDraftCheats.
function simulateSoloDraw(playerNames, clubNames) {
  const remainingPlayers = [...playerNames].sort(() => Math.random() - 0.5);
  const remainingClubs = [...clubNames];
  const resultTeams = [];
  while (remainingPlayers.length > 0) {
    const p1 = remainingPlayers.shift();
    // Verein: erst schauen, ob eine Vorgabe für diesen Spieler existiert, sonst zufällig
    // (reserviert-bewusst - schützt Vereine, die für noch ausstehende Vorgaben gebraucht werden)
    const clubCheat = draftCheats.find(c => c.p1 === p1 && c.club);
    let clubIndex = clubCheat ? remainingClubs.indexOf(clubCheat.club) : -1;
    if (clubIndex === -1) {
      const reservedClubs = new Set();
      getPendingDraftCheats(remainingPlayers).forEach(c => { if (c.club) reservedClubs.add(c.club); });
      clubIndex = pickRandomIndexAvoidingReserved(remainingClubs, reservedClubs);
    }
    const club = remainingClubs.splice(clubIndex, 1)[0];
    resultTeams.push({ id: resultTeams.length + 1, name: `Team ${resultTeams.length + 1}`, p1, p2: null, club });
  }
  return resultTeams;
}
// ============================================================================
// 6. LIVE-AUSLOSUNGS-SHOW (Glücksrad) — 3-Schritt-System pro Team: Spieler 1 -> Spieler 2 -> Club.
//    Läuft bei allen Zuschauern synchron mit, weil jeder Zwischenschritt per
//    saveData() in Firebase landet (siehe draftState in Abschnitt 2).
// ============================================================================
// Prüft vor der Auslosung, ob genug Spieler/Vereine für den aktuellen Turniermodus vorhanden
// sind. Gibt bei Problemen eine passende Fehlermeldung zurück, sonst null.
function checkDrawPrerequisites() {
  const solo = tournamentMode === 'solo';
  if (solo) {
    if (players.length < 2) return `Du benötigst mindestens 2 Spieler (aktuell: ${players.length}).`;
    if (availableClubs.length < players.length) return `Du hast zu wenige Profi-Clubs in der Liste! Mindestens ${players.length} benötigt (jeder Spieler bekommt seinen eigenen).`;
  } else {
    if (players.length < 4 || players.length % 2 !== 0) return `Du benötigst eine gerade und ausreichend hohe Anzahl an Spielern (aktuell: ${players.length}).`;
    if (availableClubs.length < (players.length / 2)) return `Du hast zu wenige Profi-Clubs in der Liste! Mindestens ${players.length / 2} benötigt.`;
  }
  return null;
}
function startInteractiveDraft() {
  if (!hasElevated()) return;
  const problem = checkDrawPrerequisites();
  if (problem) return alert(problem);
  if (confirm('Soll die Auslosungs-Show jetzt LIVE gestartet werden?')) {
    teams = [];
    groups = [];
    groupMatches = [];
    koMatches = [];
    tips = {};
    tipsEvaluated = false;
    draftState = {
      active: true,
      mode: tournamentMode === 'solo' ? 'solo' : 'duo', // im draftState mitgeführt, damit ALLE (auch Zuschauer) denselben Ablauf sehen
      currentStep: 0, // Duo: 0=P1, 1=P2, 2=Club — Solo: 0=Spieler, 1=Club
      tempP1: null,
      tempP2: null,
      remainingPlayers: [...players.map(p => p.name)],
      remainingClubs: [...availableClubs],
      spinning: false,
      startTime: null,
      targetAngle: 0,
      duration: 4000,
      lastDrawnItem: null,
      pairs: [],
      pendingTarget: null
    };
    saveData();
    handleLiveDraftUI();
  }
}
// Lost Teams & Clubs SOFORT ohne die Glücksrad-Show/Animation aus - praktisch zum
// schnellen Testen, wenn man nicht jedes Mal die vollen Dreh-Animationen abwarten will.
// Nutzt exakt dieselben Regeln wie die Live-Show (im Duo-Modus 2er-Teams, im Solo-Modus
// je Spieler ein eigener Verein - siehe simulateTeamDraw/simulateSoloDraw).
function quickDrawTeams() {
  if (!hasElevated()) return;
  const problem = checkDrawPrerequisites();
  if (problem) return alert(problem);
  if (!confirm('Teams & Clubs SOFORT ohne Glücksrad-Show auslosen?')) return;
  teams = tournamentMode === 'solo'
    ? simulateSoloDraw(players.map(p => p.name), availableClubs)
    : simulateTeamDraw(players.map(p => p.name), availableClubs);
  groups = [];
  groupMatches = [];
  koMatches = [];
  tips = {};
  tipsEvaluated = false;
  draftState = { active: false, currentStep: 0, tempP1: null, tempP2: null, remainingPlayers: [], remainingClubs: [], spinning: false, startTime: null, targetAngle: 0, duration: 4000, lastDrawnItem: null, pairs: [], pendingTarget: null };
  saveData();
  showTab('teams');
  renderAll();
  alert('⚡ Teams & Clubs wurden sofort ausgelost!');
}
// Darts-Turniere brauchen kein Team-Glücksrad: es gibt keine Partner und keine Vereine,
// jeder Spieler IST direkt sein eigenes "Team" (Datenmodell bleibt dasselbe wie im
// Solo-Modus, nur eben mit club:null überall) - deshalb reicht ein einziger Klick.
function createDartsTeamsFromPlayers() {
  if (!hasElevated()) return;
  if (players.length < 2) return alert(`Du benötigst mindestens 2 Spieler (aktuell: ${players.length}).`);
  if (!confirm(`${players.length} Spieler direkt als Darts-Teilnehmer übernehmen (kein Verein, keine Auslosung nötig)?`)) return;
  const shuffled = [...players].sort(() => Math.random() - 0.5);
  teams = shuffled.map((p, i) => ({ id: i + 1, name: p.name, p1: p.name, p2: null, club: null }));
  groups = [];
  groupMatches = [];
  koMatches = [];
  koByeTeamIds = [];
  tips = {};
  tipsEvaluated = false;
  saveData();
  showTab('teams');
  renderAll();
  alert('🎯 Teilnehmer übernommen! Weiter geht’s mit der Gruppen- oder KO-Auslosung.');
}

// Zeigt/versteckt das Auslosungs-Modal je nach draftState und rendert den aktuellen Schritt
function handleLiveDraftUI() {
  const modal = document.getElementById('draft-modal');
  if (!modal) return;
  if (draftState && draftState.active) {
    modal.style.display = 'flex';
    renderDraftStep();
    return;
  }
  if (groupDraftState && groupDraftState.active) {
    modal.style.display = 'flex';
    renderGroupDraftStep();
    return;
  }
  modal.style.display = 'none';
  if (animFrameId) cancelAnimationFrame(animFrameId);
}

// Baut die Anzeige für den aktuellen Auslosungs-Schritt auf (Spieler 1 / Spieler 2 / Club)
function renderDraftStep() {
  const stage = document.getElementById('draft-stage');
  if (!stage) return;
  const solo = draftState.mode === 'solo';
  const clubStep = solo ? 1 : 2;
  // Recovery: Die Animation sollte laut startTime/duration längst fertig sein, aber
  // spinning ist noch true (z.B. weil der lokale setTimeout durch einen Tab-Reload oder
  // Hintergrund-Drosselung verloren ging) - dann JETZT aus dem (in Firebase gespeicherten)
  // pendingTarget auflösen, statt für immer "spinning" hängen zu bleiben.
  if (hasElevated() && draftState.spinning && draftState.startTime && draftState.pendingTarget != null) {
    const elapsed = Date.now() - draftState.startTime;
    if (elapsed >= (draftState.duration || 4000)) {
      if (draftSpinTimeoutId) { clearTimeout(draftSpinTimeoutId); draftSpinTimeoutId = null; }
      applyDrawnDraftItem(draftState.pendingTarget, solo, clubStep);
      return;
    }
  }
  const noPlayersLeft = !draftState.remainingPlayers || draftState.remainingPlayers.length === 0;
  const noDuoPending = !draftState.tempP1 && !draftState.tempP2 && !draftState.lastDrawnItem;
  if (noPlayersLeft && noDuoPending) {
    stage.innerHTML = `
      <h3 style="color:#4CAF50; margin-bottom: 10px;">🎉 Alle Teams & Clubs wurden gelost! 🎉</h3>
      <p>${solo ? 'Jeder Spieler hat seinen Profi-Verein.' : 'Die Duos und ihre Profi-Vereine stehen fest.'}</p>
      ${hasElevated() ? `
        <button class="btn-primary role-btn" style="margin-top:15px;" onclick="finishDraft()">
          💾 Teams speichern & Auslosung beenden
        </button>
      ` : '<p style="color:var(--fal-yellow);">Warte auf Admin-Bestätigung...</p>'}
      <button class="btn-secondary role-btn" style="margin-top:10px;" onclick="goToLandingPage()">🔄 Turnier wechseln</button>
    `;
    return;
  }
  const currentTeamNum = (draftState.pairs ? draftState.pairs.length : teams.length) + 1;
  let stepText = '';
  if (solo) {
    if (draftState.currentStep === 0) stepText = '🎰 Lose <strong>Spieler</strong>';
    else if (draftState.currentStep === clubStep) stepText = `🎰 Lose <strong>Verein</strong> für ${draftState.tempP1}`;
  } else {
    if (draftState.currentStep === 0) stepText = '🎰 Step 1: Lose <strong>Spieler 1</strong>';
    else if (draftState.currentStep === 1) stepText = `🎰 Step 2: Lose <strong>Spieler 2</strong> (Partner für ${draftState.tempP1})`;
    else if (draftState.currentStep === clubStep) stepText = `🎰 Step 3: Lose <strong>Club</strong> für Duo ${draftState.tempP1} & ${draftState.tempP2}`;
  }
  stage.innerHTML = `
    <p style="font-size:0.9em; opacity:0.8;">Erstelle Team ${currentTeamNum}</p>
    <h3 style="margin:5px 0; color:var(--fal-yellow);">${stepText}</h3>
    <div style="background:rgba(0,0,0,0.3); padding:10px; border-radius:8px; margin: 10px 0;">
      <small style="opacity:0.7;">${solo ? 'Aktueller Spieler:' : 'Aktuelles Status-Duo:'}</small><br>
      ${solo
        ? `<strong>${draftState.tempP1 ? draftState.tempP1 : '???'}</strong>`
        : `<strong>${draftState.tempP1 ? draftState.tempP1 : '???'}</strong> & <strong>${draftState.tempP2 ? draftState.tempP2 : '???'}</strong>`}
    </div>
    <div class="wheel-container" style="position:relative; width:260px; margin:0 auto;">
      <div class="wheel-pointer" style="position:absolute; top:-10px; left:50%; transform:translateX(-50%); width:0; height:0; border-left:10px solid transparent; border-right:10px solid transparent; border-top:15px solid red; z-index:10;"></div>
      <canvas id="wheel-canvas" width="260" height="260"></canvas>
    </div>
    <div id="spin-result" style="height: 35px; font-weight: bold; font-size: 1.1em; color: var(--fal-yellow); margin-top:5px;">
      ${draftState.lastDrawnItem ? `🎯 Gezogen: <u>${draftState.lastDrawnItem}</u>` : ''}
    </div>
    ${hasElevated() ? `
      <div style="margin-top:15px; display:flex; gap:10px; justify-content:center;">
        <button class="btn-secondary role-btn" style="background:#e74c3c; color:white; border:none;" onclick="cancelDraft()">
          🛑 Abbrechen
        </button>
        ${!draftState.spinning && !draftState.lastDrawnItem ? `
          <button class="btn-primary role-btn" id="btn-spin-wheel" onclick="spinWheel()">
            🎰 Rad drehen
          </button>
        ` : ''}
        ${draftState.spinning && draftState.pendingTarget != null ? `
          <button class="btn-primary role-btn" onclick="skipWheelSpin()">
            ⏭️ Überspringen
          </button>
        ` : ''}
        ${!draftState.spinning && draftState.lastDrawnItem ? `
          <button class="btn-primary role-btn" onclick="nextDraftStep()">
            Weiter ➡️
          </button>
        ` : ''}
      </div>
    ` : `
      <p style="font-size:0.9em; opacity:0.8; margin-top:10px;">
        ${draftState.spinning ? '🎰 Das Rad dreht sich live...' : 'Der Admin dreht gleich am Rad!'}
      </p>
    `}
    <button class="btn-secondary role-btn" style="margin-top:10px;" onclick="goToLandingPage()">🔄 Turnier wechseln</button>
  `;
  startWheelAnimationLoop();
}

// Startet die requestAnimationFrame-Schleife, die das Glücksrad dreht
function startWheelAnimationLoop() {
  if (animFrameId) cancelAnimationFrame(animFrameId);
  function animate() {
    if (!draftState || !draftState.active) return;
    let currentAngle = 0;
    if (draftState.spinning && draftState.startTime) {
      const elapsed = Date.now() - draftState.startTime;
      const progress = Math.min(elapsed / (draftState.duration || 4000), 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      currentAngle = (draftState.targetAngle || 0) * easeOut;
      if (progress >= 1) {
        drawWheelCanvas(draftState.targetAngle);
        return;
      }
    } else {
      currentAngle = draftState.targetAngle || 0;
    }
    drawWheelCanvas(currentAngle);
    if (draftState.spinning) {
      animFrameId = requestAnimationFrame(animate);
    }
  }
  animFrameId = requestAnimationFrame(animate);
}

// Zeichnet das Glücksrad (Segmente, Farben, Beschriftung, Wappen) auf das Canvas
function drawWheelCanvas(angleOffset) {
  const canvas = document.getElementById('wheel-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  const isClubWheel = (draftState.currentStep === (draftState.mode === 'solo' ? 1 : 2));
  let items = isClubWheel ? draftState.remainingClubs : draftState.remainingPlayers;
  const numItems = items ? items.length : 0;
  
  ctx.clearRect(0, 0, 260, 260);
  if (numItems === 0) return;

  const centerX = 130;
  const centerY = 130;
  const radius = 130;
  const sliceAngle = (2 * Math.PI) / numItems;

  for (let i = 0; i < numItems; i++) {
    const startAngle = angleOffset + i * sliceAngle;
    const endAngle = startAngle + sliceAngle;
    const itemText = String(items[i]);

    // Segment-Hintergrundfarbe einmal bestimmen (wird für Füllung UND Textfarbe gebraucht)
    const segmentColor = isClubWheel
      ? ((typeof getClubColor === 'function' && getClubColor(itemText)) ? getClubColor(itemText) : (i % 2 === 0 ? '#1b365d' : '#f1c40f'))
      : ((i % 2 === 0) ? '#1b365d' : '#f1c40f');

    // 🎨 Farbfüllung Segmente
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = segmentColor;
    ctx.fill();

    // 📐 Deutliche Segment-Trennlinien
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    // 📝 Text & Wappen auf dem Rad
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(startAngle + sliceAngle / 2);
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";

    ctx.font = "bold 13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif";

    // Textfarbe automatisch an die Helligkeit des Segment-Hintergrunds anpassen
    // (z.B. dunkler Text auf hellem Gelb/Hellblau, heller Text auf dunklem Blau/Rot).
    // Die Kontur ist dünn UND passend eingefärbt, damit z.B. ein "M" nicht zu einem
    // schwarzen Klecks verschmiert (das Problem bei der alten, dicken schwarzen Kontur).
    const textColor = getReadableTextColor(segmentColor);
    const outlineColor = (textColor === '#ffffff') ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.65)';
    ctx.strokeStyle = outlineColor;
    ctx.lineWidth = 1.5;
    ctx.strokeText(itemText, radius - 35, 0);
    ctx.fillStyle = textColor;
    ctx.fillText(itemText, radius - 35, 0);

    // 🖼️ Wappen rendern bei Vereinsrad
    if (isClubWheel && typeof getClubLogoImageElement === 'function') {
      const logoImg = getClubLogoImageElement(itemText);
      if (logoImg && logoImg.complete && logoImg.naturalWidth !== 0) {
        ctx.drawImage(logoImg, radius - 28, -10, 20, 20);
      }
    }

    ctx.restore();
  }
}

// Admin dreht das Rad: würfelt zufällig ein Element aus dem aktuellen Pool und startet die Dreh-Animation
// Übernimmt ein gezogenes Element (Spieler oder Club) in den draftState - je nach Schritt
// entweder als tempP1/tempP2 oder als neu abgeschlossenes Team/Duo. Gemeinsam genutzt von
// spinWheel() (nach der Dreh-Animation) und dem Ein-Element-Sonderfall (siehe dort).
function applyDrawnDraftItem(item, solo, clubStep) {
  draftState.spinning = false;
  draftState.pendingTarget = null;
  draftState.lastDrawnItem = item;
  if (draftState.currentStep === 0) {
    draftState.tempP1 = item;
  } else if (draftState.currentStep === clubStep) {
    if (!draftState.pairs) draftState.pairs = [];
    draftState.pairs.push({
      id: draftState.pairs.length + 1,
      name: `Team ${draftState.pairs.length + 1}`,
      p1: draftState.tempP1,
      p2: solo ? null : draftState.tempP2,
      club: item
    });
  } else {
    // Nur Duo: currentStep === 1 (Partner-Ziehung)
    draftState.tempP2 = item;
  }
  saveData();
  renderDraftStep();
}
function spinWheel() {
  if (!hasElevated() || draftState.spinning) return;
  const solo = draftState.mode === 'solo';
  const clubStep = solo ? 1 : 2;
  let currentPool = (draftState.currentStep === clubStep) ? draftState.remainingClubs : draftState.remainingPlayers;
  if (!currentPool || currentPool.length === 0) {
    return alert("Keine Elemente mehr zum Auslosen im aktuellen Pool!");
  }
  // Bleibt nur noch EIN Element übrig, gibt's nichts mehr auszulosen - UND ein Rad mit nur
  // einem (Voll-Kreis-)Segment sieht beim Drehen optisch immer gleich aus, das wirkt wie
  // hängengeblieben. Deshalb direkt automatisch übernehmen, ganz ohne Dreh-Animation.
  if (currentPool.length === 1) {
    draftState.targetAngle = 0;
    applyDrawnDraftItem(currentPool[0], solo, clubStep);
    return;
  }
  // Voreinstellungen prüfen: der erste Spieler bleibt IMMER ehrlich zufällig (schließlich muss
  // irgendwer als erstes gezogen werden) - erst beim Verein (Solo) bzw. beim Partner UND Verein
  // (Duo) wird geschaut, ob dafür eine Vorgabe hinterlegt ist. Eine Duo-Vorgabe kann einen
  // festen Partner haben ODER den Partner offen lassen ("egal") und nur den Verein festlegen.
  // Das Rad dreht sich optisch trotzdem ganz normal, landet aber gezielt auf dem passenden Feld.
  let targetIndex = null;
  if (draftState.currentStep === clubStep && draftState.tempP1) {
    const cheat = solo
      ? draftCheats.find(c => c.club && c.p1 === draftState.tempP1)
      : (draftState.tempP2 ? draftCheats.find(c => {
          if (!c.club) return false;
          if (c.p2) {
            // Vorgabe mit festem Partner: muss exakt zu diesem Duo passen
            return (c.p1 === draftState.tempP1 && c.p2 === draftState.tempP2) ||
                   (c.p1 === draftState.tempP2 && c.p2 === draftState.tempP1);
          }
          // Vorgabe ohne festen Partner: reicht, wenn der eine festgelegte Spieler dabei ist
          return c.p1 === draftState.tempP1 || c.p1 === draftState.tempP2;
        }) : null);
    if (cheat) {
      const idx = currentPool.indexOf(cheat.club);
      if (idx !== -1) targetIndex = idx;
    }
  } else if (!solo && draftState.currentStep === 1 && draftState.tempP1) {
    // Nur Duo: Nur Vorgaben mit festem Partner sind hier relevant (Partner "egal" wirkt erst beim Verein)
    const cheat = draftCheats.find(c => c.p2 && (c.p1 === draftState.tempP1 || c.p2 === draftState.tempP1));
    if (cheat) {
      const partner = cheat.p1 === draftState.tempP1 ? cheat.p2 : cheat.p1;
      const idx = currentPool.indexOf(partner);
      if (idx !== -1) targetIndex = idx;
    }
  }
  if (targetIndex === null) {
    // Rein zufällige Ziehung - aber NICHT blind: Spieler/Vereine, die für eine andere,
    // noch nicht eingelöste Voreinstellung reserviert sind, werden dabei nach Möglichkeit
    // übersprungen. Sonst könnte z.B. der Wunsch-Partner oder -Verein eines Spielers schon
    // in einer früheren Runde für ein fremdes Team weggezogen werden, bevor der eigentliche
    // Spieler überhaupt an der Reihe war (der gemeldete Bug).
    const reserved = new Set();
    if (!solo && draftState.currentStep === 1) {
      getPendingDraftCheats(draftState.remainingPlayers).forEach(c => { if (c.p2) { reserved.add(c.p1); reserved.add(c.p2); } });
    } else if (draftState.currentStep === clubStep) {
      getPendingDraftCheats(draftState.remainingPlayers).forEach(c => { if (c.club) reserved.add(c.club); });
    }
    targetIndex = reserved.size > 0 ? pickRandomIndexAvoidingReserved(currentPool, reserved) : Math.floor(Math.random() * currentPool.length);
  }
  const targetItem = currentPool[targetIndex];
  const numItems = currentPool.length;
  const sliceAngle = (2 * Math.PI) / numItems;
  const targetSegmentCenter = (targetIndex + 0.5) * sliceAngle;
  const targetAngleAtTop = (1.5 * Math.PI) - targetSegmentCenter;
  const totalRotation = (2 * Math.PI * 5) + targetAngleAtTop;
  draftState.spinning = true;
  draftState.startTime = Date.now();
  draftState.targetAngle = totalRotation;
  draftState.duration = 4000;
  draftState.lastDrawnItem = null;
  // Ergebnis steht schon fest (nur die Animation läuft noch) - im draftState (also in
  // Firebase) gemerkt statt nur in einer lokalen JS-Variable. Sonst bliebe das Rad für immer
  // hängen, falls der Tab während der ~4s Animation neu lädt oder in den Hintergrund gerät
  // (z.B. Bildschirm sperrt sich) und der lokale setTimeout dadurch verloren geht.
  draftState.pendingTarget = targetItem;
  saveData();
  if (draftSpinTimeoutId) clearTimeout(draftSpinTimeoutId);
  draftSpinTimeoutId = setTimeout(() => {
    draftSpinTimeoutId = null;
    if (hasElevated() && draftState.spinning) {
      applyDrawnDraftItem(targetItem, solo, clubStep);
    }
  }, 4100);
}
// Admin/God kann die laufende Dreh-Animation überspringen, statt die vollen ~4s abzuwarten -
// übernimmt sofort dasselbe (schon feststehende) Ergebnis, das der reguläre Timer ohnehin
// geliefert hätte.
function skipWheelSpin() {
  if (!hasElevated() || !draftState.spinning || draftState.pendingTarget == null) return;
  if (draftSpinTimeoutId) { clearTimeout(draftSpinTimeoutId); draftSpinTimeoutId = null; }
  const solo = draftState.mode === 'solo';
  const clubStep = solo ? 1 : 2;
  applyDrawnDraftItem(draftState.pendingTarget, solo, clubStep);
}

// Übernimmt das zuletzt gezogene Element (Spieler/Club) und schaltet zum nächsten Auslosungs-Schritt
function nextDraftStep() {
  if (!hasElevated()) return;
  const solo = draftState.mode === 'solo';
  const clubStep = solo ? 1 : 2;
  if (draftState.lastDrawnItem) {
    if (draftState.currentStep === clubStep) {
      const idx = draftState.remainingClubs.indexOf(draftState.lastDrawnItem);
      if (idx !== -1) draftState.remainingClubs.splice(idx, 1);
      draftState.tempP1 = null;
      draftState.tempP2 = null;
      draftState.currentStep = 0;
    } else {
      const idx = draftState.remainingPlayers.indexOf(draftState.lastDrawnItem);
      if (idx !== -1) draftState.remainingPlayers.splice(idx, 1);
      draftState.currentStep = draftState.currentStep + 1;
    }
  }
  draftState.lastDrawnItem = null;
  draftState.targetAngle = 0;
  draftState.startTime = null;
  draftState.spinning = false;
  saveData();
  renderDraftStep();
}

// Übernimmt die fertig gelosten Duos als offizielle Teams und beendet die Auslosungs-Show
function finishDraft() {
  if (!hasElevated()) return;
  teams = [...draftState.pairs];
  draftState.active = false;
  draftCheats = []; // erledigt - für die nächste Auslosung muss neu vorausgewählt werden
  saveData();
  showTab('teams');
  renderAll();
  alert("🎉 Auslosung beendet! Die Teams wurden geladen.");
}

// Bricht die laufende Auslosung ab und setzt den Auslosungs-Zustand komplett zurück
function cancelDraft() {
  if (!hasElevated()) return;
  if (confirm("Möchtest du die Auslosung wirklich abbrechen und zurücksetzen?")) {
    if (animFrameId) cancelAnimationFrame(animFrameId);
    // Ein evtl. noch laufender Dreh-Timer darf NICHT später auf die (gleich zurückgesetzte)
    // Auslosung zugreifen - sonst könnte er nach einem sofortigen Neustart der Auslosung
    // versehentlich ein Ergebnis in die neue, gerade erst begonnene Runde schreiben.
    if (draftSpinTimeoutId) { clearTimeout(draftSpinTimeoutId); draftSpinTimeoutId = null; }
    draftState = {
      active: false, spinning: false, currentStep: 0,
      tempP1: null, tempP2: null, lastDrawnItem: null,
      remainingPlayers: [], remainingClubs: [], pairs: [], pendingTarget: null
    };
    saveData();
    const modal = document.getElementById('draft-modal');
    if (modal) modal.style.display = 'none';
    renderAll();
    alert("Auslosung wurde zurückgesetzt!");
  }
}
// ============================================================================
// 7. STANDARD ADMIN HANDLUNGEN — Spieler hinzufügen/löschen, Test-Spieler,
//    Ref-Rechte vergeben, Passwörter, Registrierungssperre
// ============================================================================
function addPlayer() {
  if (!hasElevated()) return;
  const input = document.getElementById('new-player-name');
  const name = input ? input.value.trim() : '';
  if (!name) return;
  if (getPlayerObj(name)) return alert('Spieler existiert bereits!');
  players.push({ name: name, isRef: false });
  input.value = '';
  saveData();
}
function removePlayer(index) {
  if (!isAdmin()) return; // NUR Admin darf Spieler löschen
  players.splice(index, 1);
  saveData();
}
// Fügt automatisch mehrere Test-Spieler hinzu (z.B. "Test 1", "Test 2", ...).
// Praktisch zum schnellen Durchtesten des Turniers mit vielen Teilnehmern.
// Nur der Admin (nicht Ref) darf das, da dies eine reine Datenmenge erzeugt.
function addTestPlayers() {
  if (!isAdmin()) return;
  const input = prompt('Wie viele Test-Spieler sollen automatisch hinzugefügt werden?', '4');
  if (input === null) return; // Abbrechen gedrückt
  const count = parseInt(input, 10);
  if (isNaN(count) || count <= 0) return alert('Bitte eine gültige Zahl größer als 0 eingeben!');
  if (count > 50) return alert('Maximal 50 Test-Spieler auf einmal, um Firebase nicht zu überlasten.');
  let added = 0;
  let n = 1;
  while (added < count) {
    const name = `Test ${n}`;
    if (!getPlayerObj(name)) {
      players.push({ name, isRef: false });
      added++;
    }
    n++;
  }
  saveData();
  alert(`✅ ${added} Test-Spieler wurden hinzugefügt.`);
}
function toggleRef(index) {
  if (!isAdmin()) return; // NUR Admin darf Ref-Rechte vergeben/entziehen
  players[index].isRef = !players[index].isRef;
  saveData();
}
// Setzt (oder ändert) das Passwort einer Identität - gilt seit dem Umbau auf identitätsweite
// Passwörter automatisch für ALLE Turniere, in denen diese Identität mitspielt (siehe God-Panel).
function setPlayerPassword(key) {
  if (!isGod()) return; // nur der God darf Passwörter verwalten
  const gp = globalPlayers[key];
  if (!gp) return;
  const pwd = prompt(`Neues Passwort für ${gp.name} eingeben (gilt für ALLE Turniere):`);
  if (pwd !== null) {
    if (pwd.trim() === '') return alert('Passwort darf nicht leer sein.');
    // Version hochzählen -> zwingt die Identität (falls gerade irgendwo angemeldet) zur
    // erneuten Anmeldung MIT Passwort, siehe markIdentityPasswordVersion.
    db.ref('globalPlayers/' + key).update({
      password: pwd.trim(),
      pendingPassword: null,
      passwordVersion: (gp.passwordVersion || 0) + 1
    }).catch((error) => alert('⚠️ Passwort konnte nicht gespeichert werden:\n' + error.message));
    alert(`✅ Passwort gesetzt. ${gp.name} muss sich beim nächsten Anmelden neu mit diesem Passwort anmelden.`);
  }
}
// Entfernt das Passwort einer Identität wieder (Konto ist danach überall offen)
function removePlayerPassword(key) {
  if (!isGod()) return; // nur der God darf Passwörter verwalten
  const gp = globalPlayers[key];
  if (!gp) return;
  if (confirm(`Passwort von ${gp.name} wirklich löschen?`)) {
    db.ref('globalPlayers/' + key + '/password').remove().catch((error) => alert('⚠️ Löschen fehlgeschlagen:\n' + error.message));
  }
}
// Spieler schlägt SELBST ein Passwort für die eigene Identität vor - wird erst aktiv, wenn
// der God es bestätigt. Gilt danach für ALLE Turniere, nicht nur das gerade offene.
function requestOwnPassword() {
  if (!myPlayerName) return;
  const pwd = prompt('Welches Passwort möchtest du für dein Konto vorschlagen?\n(Gilt danach für ALLE Turniere. Der God muss es noch bestätigen, bevor es aktiv wird.)');
  if (pwd === null) return;
  if (pwd.trim() === '') return alert('Passwort darf nicht leer sein.');
  const key = myPlayerName.trim().toLowerCase();
  const gp = getGlobalPlayer(myPlayerName);
  // Per update() statt set() auf den Unterpfad - heilt nebenbei einen fehlenden/unvollständigen
  // Registry-Eintrag (z.B. weil der God die Identität mal gelöscht hatte, das Gerät sich aber
  // noch daran "erinnert") automatisch, statt einen kaputten Eintrag ohne Namen zu erzeugen.
  db.ref('globalPlayers/' + key).update({
    name: myPlayerName,
    createdAt: (gp && gp.createdAt) || Date.now(),
    pendingPassword: pwd.trim()
  }).catch((error) => alert('⚠️ Konnte nicht gespeichert werden:\n' + error.message));
  alert('✅ Dein Passwort-Wunsch wurde gespeichert und wartet auf Bestätigung durch den God.');
}
// God bestätigt einen von einer Identität selbst vorgeschlagenen Passwort-Wunsch -> wird aktiv
function confirmPendingPassword(key) {
  if (!isGod()) return; // nur der God darf Passwörter verwalten
  const gp = globalPlayers[key];
  if (!gp || !gp.pendingPassword) return;
  db.ref('globalPlayers/' + key).update({
    password: gp.pendingPassword,
    pendingPassword: null,
    passwordVersion: (gp.passwordVersion || 0) + 1
  }).catch((error) => alert('⚠️ Bestätigen fehlgeschlagen:\n' + error.message));
  alert(`✅ Passwort-Wunsch von ${gp.name} bestätigt. ${gp.name} muss sich beim nächsten Anmelden neu mit diesem Passwort anmelden.`);
}
// God lehnt einen vorgeschlagenen Passwort-Wunsch ab (Spieler kann einen neuen vorschlagen)
function rejectPendingPassword(key) {
  if (!isGod()) return; // nur der God darf Passwörter verwalten
  if (!globalPlayers[key]) return;
  db.ref('globalPlayers/' + key + '/pendingPassword').remove().catch((error) => alert('⚠️ Ablehnen fehlgeschlagen:\n' + error.message));
}
// Sperrt/entsperrt die Neu-Registrierung, damit sich keine weiteren Spieler mehr anmelden können
function toggleRegistrationLock() {
  if (!hasElevated()) return;
  registrationLocked = !registrationLocked;
  saveData();
}
// Wechselt zwischen Duo- (2er-Teams) und Solo-Modus (1 Spieler pro Verein) - nur solange
// noch keine Teams gelost wurden (siehe teams.length===0-Check in renderAdminPanel).
function toggleTournamentMode() {
  if (!hasElevated()) return;
  if (teams.length > 0) return alert('Der Modus kann nach der Auslosung nicht mehr geändert werden!');
  tournamentMode = tournamentMode === 'solo' ? 'duo' : 'solo';
  saveData();
  renderAll();
}
// Wechselt zwischen ⚽ FIFA (mit Vereinen) und 🎯 Darts (kein Verein, jeder Spieler ist sein
// eigenes Team) - nur solange noch keine Teams existieren. Darts erzwingt automatisch den
// Solo-Modus (kein Partner-Konzept bei Darts).
function toggleTournamentSport() {
  if (!hasElevated()) return;
  if (teams.length > 0) return alert('Die Sportart kann nach der Auslosung nicht mehr geändert werden!');
  tournamentSport = tournamentSport === 'darts' ? 'fifa' : 'darts';
  if (tournamentSport === 'darts') tournamentMode = 'solo';
  saveData();
  renderAll();
}
// Setzt/ändert das optionale Beitritts-Passwort für dieses Turnier nachträglich (nicht nur
// bei der Erstellung) - wer noch NICHT Spieler hier ist, braucht es dann zum Beitreten.
function setTournamentJoinPassword() {
  if (!hasElevated()) return;
  const pwd = prompt('Beitritts-Passwort für dieses Turnier festlegen (nur NEUE Spieler brauchen es zum Beitreten):', joinPassword || '');
  if (pwd === null) return;
  if (!pwd.trim()) return alert('Leeres Passwort - benutze stattdessen "Beitritts-Passwort entfernen".');
  joinPassword = pwd.trim();
  saveData();
  renderAll();
}
// Entfernt das Beitritts-Passwort wieder - danach kann jeder ohne Passwort beitreten
function clearTournamentJoinPassword() {
  if (!hasElevated()) return;
  joinPassword = null;
  saveData();
  renderAll();
}
// Ändert den Zeitabstand zwischen zwei Spiel-Slots (Hauptplatz+Nebenplatz) und
// berechnet den Zeitplan aller noch nicht gestarteten/gespielten Spiele sofort neu
function updateMatchInterval() {
  if (!hasElevated()) return;
  const input = document.getElementById('match-interval-input');
  const val = input ? parseInt(input.value, 10) : NaN;
  if (isNaN(val) || val <= 0) return alert('Bitte eine gültige Anzahl Minuten (größer als 0) eingeben!');
  matchIntervalMinutes = val;
  rescheduleWholeArray(groupMatches);
  rescheduleWholeArray(koMatches);
  saveData();
  renderAll();
  alert(`✅ Zeitabstand auf ${val} Minuten geändert – der Spielplan wurde entsprechend aktualisiert.`);
}
// ============================================================================
// 8. GRUPPEN- & KO-AUSLOSUNG — Gruppenphase erstellen (beliebige Gruppenanzahl), dann eine
//    frei wählbare Gesamt-Teilnehmerzahl für die KO-Runde (siehe advanceKORound weiter
//    unten), die automatisch passende Runden (Achtelfinale/Viertelfinale/Halbfinale/
//    Finale + Spiel um Platz 3) erzeugt, inkl. Quervergleich & Freilosen bei Bedarf.
// ============================================================================
function makeMatch(id, group, slot, t1Id, t2Id) {
  return {
    id, group, slot,
    court: null,
    t1Id, t2Id,
    // Solo-Modus hat keine Teampartner zum Über-Kreuz-Losen -> immer false.
    crossed: tournamentMode === 'solo' ? false : Math.random() < 0.5, // zufällig: 1v1 oder über Kreuz (1v2 / 2v1)
    score1_h: null, score2_h: null,
    score1_r: null, score2_r: null,
    score1: null, score2: null,
    played: false,
    confirmed: false,
    betsEvaluated: false,
    started: false, // true = Admin/Ref hat das Spiel als "läuft" markiert -> keine Wetten mehr möglich
    scheduledTime: null // geplante Startzeit (Unix-Millisekunden), siehe assignScheduledTimes
  };
}
// Erzeugt ein neues KO-Spiel-Objekt (Viertelfinale, Halbfinale, Finale, Spiel um Platz 3)
function makeKOMatch(id, round, court, t1Id, t2Id) {
  return {
    id, round, court,
    t1Id, t2Id,
    crossed: tournamentMode === 'solo' ? false : Math.random() < 0.5,
    score1_h: null, score2_h: null,
    score1_r: null, score2_r: null,
    score1: null, score2: null,
    played: false,
    confirmed: false,
    betsEvaluated: false,
    started: false, // true = Admin/Ref hat das Spiel als "läuft" markiert -> keine Wetten mehr möglich
    scheduledTime: null // geplante Startzeit (Unix-Millisekunden), siehe assignScheduledTimes
  };
}
// ---- ZEITPLAN-HELFER ----
// Formatiert einen Unix-Zeitstempel als lesbare Uhrzeit (z.B. "18:20 Uhr")
function formatMatchTime(ms) {
  if (!ms) return '';
  return new Date(ms).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) + ' Uhr';
}
// Verteilt Startzeiten auf eine Liste NEU erstellter Spiele: je 2 direkt aufeinander-
// folgende Spiele (Hauptplatz + Nebenplatz) bekommen dieselbe Zeit ("spielen zeitgleich"),
// das nächste Paar ist matchIntervalMinutes später dran, usw. baseTime ist meist "jetzt"
// (der Moment, in dem der Admin die Auslosung/Runde erstellt).
function assignScheduledTimes(newMatches, baseTime) {
  newMatches.forEach((m, idx) => {
    m.scheduledTime = baseTime + Math.floor(idx / 2) * matchIntervalMinutes * 60000;
  });
}
// Wird beim Starten eines Spiels aufgerufen: passt die geplanten Uhrzeiten aller NOCH
// NICHT gestarteten/gespielten Spiele im selben Spielplan (Gruppen- oder KO-Phase) an,
// ausgehend vom TATSÄCHLICHEN Startzeitpunkt des gerade gestarteten Spiels. So gleicht
// sich der Zeitplan bei Verspätungen (oder wenn's mal schneller geht) automatisch an.
function rescheduleFollowingMatches(matchArray, startedMatch) {
  const idx = matchArray.indexOf(startedMatch);
  if (idx === -1) return;
  const startedPairIndex = Math.floor(idx / 2);
  const anchorTime = startedMatch.scheduledTime;
  matchArray.forEach((m, i) => {
    if (m.started || m.played) return; // Vergangenheit/Laufendes nicht mehr anfassen
    const pairIndex = Math.floor(i / 2);
    if (pairIndex < startedPairIndex) return;
    m.scheduledTime = anchorTime + (pairIndex - startedPairIndex) * matchIntervalMinutes * 60000;
  });
}
// Wird aufgerufen, wenn der Admin den Zeitabstand (matchIntervalMinutes) ändert: berechnet
// alle noch nicht gestarteten/gespielten Spiele im Array neu. Anker ist das zuletzt
// gestartete Spiel (dessen Zeit ist ja Fakt), sonst die Zeit des allerersten Spiels.
function rescheduleWholeArray(matchArray) {
  if (!matchArray || matchArray.length === 0) return;
  let anchorTime = null;
  let anchorPairIndex = 0;
  matchArray.forEach((m, i) => {
    if ((m.started || m.played) && m.scheduledTime) {
      const pairIndex = Math.floor(i / 2);
      if (anchorTime === null || pairIndex > anchorPairIndex) {
        anchorTime = m.scheduledTime;
        anchorPairIndex = pairIndex;
      }
    }
  });
  if (anchorTime === null) {
    anchorTime = matchArray[0].scheduledTime || Date.now();
    anchorPairIndex = 0;
  }
  matchArray.forEach((m, i) => {
    if (m.started || m.played) return;
    const pairIndex = Math.floor(i / 2);
    if (pairIndex < anchorPairIndex) return;
    m.scheduledTime = anchorTime + (pairIndex - anchorPairIndex) * matchIntervalMinutes * 60000;
  });
}
// Erzeugt die Gruppen-Bezeichnungen "Gruppe A".."Gruppe Z" (max. 26 Gruppen)
function generateGroupLetters(n) {
  const letters = [];
  for (let i = 0; i < n; i++) letters.push('Gruppe ' + String.fromCharCode(65 + i));
  return letters;
}
// Prüft, ob eine gewünschte Gruppenanzahl mit der aktuellen Team-Anzahl grundsätzlich
// möglich ist (mind. 2 Teams pro Gruppe, max. 26 Gruppen wegen A-Z). Gibt bei Erfolg
// null zurück, sonst eine Fehlermeldung.
// itemLabel/minPerGroup generisch gehalten, damit dieselbe Prüfung auch für die "nur Namen,
// ohne Verein"-Gruppenauslosung (siehe startGroupDraft) mit min. 1 Person pro Gruppe passt.
function validateGroupCount(n, poolSize, itemLabel, minPerGroup) {
  if (poolSize === undefined) poolSize = teams ? teams.length : 0;
  if (itemLabel === undefined) itemLabel = 'Teams';
  if (minPerGroup === undefined) minPerGroup = 2;
  if (isNaN(n) || n < 2) return 'Bitte eine Zahl ab 2 als Gruppenanzahl eingeben!';
  if (n > 26) return 'Maximal 26 Gruppen werden unterstützt (Gruppe A bis Gruppe Z).';
  if (poolSize < n * minPerGroup) return `Für ${n} Gruppen benötigst du mindestens ${n * minPerGroup} ${itemLabel} (aktuell: ${poolSize}), damit jede Gruppe mindestens ${minPerGroup} bekommt.`;
  return null;
}
// Baut aus den fertig befüllten "groups" (letter + teams[]) den kompletten Gruppen-
// Spielplan (Hin- und Rückspiele aller Team-Paare je Gruppe, über alle Gruppen verzahnt),
// setzt die KO-Phase zurück und speichert. Gemeinsam genutzt von quickDrawGroups() und
// finishGroupDraft() (Glücksrad-Variante), damit die Spielplan-Logik nur einmal existiert.
function buildGroupScheduleAndSave() {
  let rawGroupMatches = [];
  groups.forEach(group => {
    const gTeams = group.teams;
    for (let i = 0; i < gTeams.length; i++) {
      for (let j = i + 1; j < gTeams.length; j++) {
        rawGroupMatches.push(makeMatch(null, group.letter, null, gTeams[i], gTeams[j]));
      }
    }
  });
  let matchesByGroup = {};
  groups.forEach(g => {
    matchesByGroup[g.letter] = rawGroupMatches.filter(m => m.group === g.letter);
  });
  let interleavedMatches = [];
  let maxLen = Math.max(0, ...Object.values(matchesByGroup).map(arr => arr.length));
  for (let i = 0; i < maxLen; i++) {
    groups.forEach(g => {
      if (matchesByGroup[g.letter][i]) interleavedMatches.push(matchesByGroup[g.letter][i]);
    });
  }
  groupMatches = [];
  let matchId = 1;
  interleavedMatches.forEach((match, idx) => {
    match.id = matchId++;
    match.slot = idx + 1;
    match.court = (idx % 2 === 1) ? 'Nebenplatz' : 'Hauptplatz';
    groupMatches.push(match);
  });
  assignScheduledTimes(groupMatches, Date.now());
  koMatches = [];
  koByeTeamIds = [];
  saveData();
  renderAll();
}
// Teilt die Teams SOFORT (ohne Glücksrad-Show) zufällig auf die gewählte Anzahl Gruppen
// (beliebig, min. 2) auf und erstellt daraus direkt den kompletten Gruppen-Spielplan.
function quickDrawGroups() {
  if (!hasElevated()) return;
  if (!teams || teams.length < 4) {
    return alert(`Du benötigst mindestens 4 Teams (aktuell: ${teams ? teams.length : 0}).`);
  }
  const input = prompt('Wie viele Gruppen sollen ausgelost werden?', String(numGroups || Math.max(2, Math.round(teams.length / 4))));
  if (input === null) return;
  const n = parseInt(input, 10);
  const err = validateGroupCount(n);
  if (err) return alert(err);
  if (!confirm(`Möchtest du die Teams jetzt zufällig auf ${n} Gruppen verteilen und den Spielplan erstellen?`)) return;
  numGroups = n;
  const groupLetters = generateGroupLetters(n);
  const shuffledTeams = [...teams].sort(() => Math.random() - 0.5);
  groups = groupLetters.map(letter => ({ letter, teams: [] }));
  shuffledTeams.forEach((team, index) => {
    groups[index % groups.length].teams.push(team.id);
  });
  buildGroupScheduleAndSave();
  showTab('matches');
  alert(`🎉 ${n} Gruppen & der komplette Spielplan wurden erfolgreich erstellt!`);
}
// ============================================================================
// 8a. GRUPPEN-GLÜCKSRAD — analog zur Team-Auslosung: zieht Team für Team per Glücksrad
//     und verteilt sie reihum auf die Gruppen (Team 1 -> Gruppe A, Team 2 -> Gruppe B, ...,
//     dann wieder von vorn). Eigene, bewusst einfachere Draft-State-Machine (groupDraftState),
//     siehe deren Deklaration weiter oben - teilt sich aber dasselbe #draft-modal-Overlay.
//     Kann wahlweise TEAMS (Standard, mit Verein/Spielplan danach) oder direkt SPIELER-NAMEN
//     lostopf-artig verteilen (source='players', z.B. für Zimmer-/Ausflugsauslosung ganz ohne
//     Fußball-Bezug) - dann gibt's hinterher keinen Spielplan, nur die fertigen Namenslisten.
// ============================================================================
// Startet die Live-Gruppen-Auslosungs-Show. source: 'teams' (Standard) oder 'players'
// (lost die Spielerliste direkt in Gruppen, ganz ohne Team/Verein-Konzept).
function startGroupDraft(source) {
  if (!hasElevated()) return;
  const isPlayers = source === 'players';
  const pool = isPlayers ? players.map(p => p.name) : (teams ? teams.map(t => t.name) : []);
  const itemLabel = isPlayers ? 'Spieler' : 'Teams';
  const minPerGroup = isPlayers ? 1 : 2;
  if (pool.length < (isPlayers ? 2 : 4)) {
    return alert(`Du benötigst mindestens ${isPlayers ? 2 : 4} ${itemLabel} (aktuell: ${pool.length}).`);
  }
  const input = prompt('Wie viele Gruppen sollen ausgelost werden?', String(numGroups || Math.max(2, Math.round(pool.length / 4))));
  if (input === null) return;
  const n = parseInt(input, 10);
  const err = validateGroupCount(n, pool.length, itemLabel, minPerGroup);
  if (err) return alert(err);
  if (!confirm(`Soll die Gruppen-Auslosungs-Show jetzt LIVE gestartet werden? ${pool.length} ${itemLabel} werden nacheinander per Glücksrad auf ${n} Gruppen verteilt.`)) return;
  numGroups = n;
  const groupLetters = generateGroupLetters(n);
  const assignments = {};
  groupLetters.forEach(l => { assignments[l] = []; });
  groupDraftState = {
    active: true, spinning: false, source: isPlayers ? 'players' : 'teams',
    remainingTeams: pool,
    groupLetters, targetGroupIndex: 0, assignments,
    lastDrawnItem: null, lastAssignedGroup: null,
    startTime: null, targetAngle: 0, duration: 4000, pendingTarget: null
  };
  saveData();
  renderAll();
  handleLiveDraftUI();
}
// Dreht das Glücksrad für das nächste zu ziehende Team (landet automatisch in der
// aktuellen Ziel-Gruppe, siehe groupDraftState.targetGroupIndex)
function spinGroupWheel() {
  if (!hasElevated() || groupDraftState.spinning) return;
  const pool = groupDraftState.remainingTeams;
  if (!pool || pool.length === 0) return alert('Keine Teams mehr übrig!');
  // Bleibt nur noch EIN Team übrig, gibt's nichts mehr auszulosen - UND ein Rad mit nur
  // einem (Voll-Kreis-)Segment sieht beim Drehen optisch immer gleich aus (siehe
  // drawGroupWheelCanvas). Deshalb direkt automatisch übernehmen, ganz ohne Animation.
  if (pool.length === 1) {
    groupDraftState.targetAngle = 0;
    applyGroupDraw(pool[0]);
    return;
  }
  const targetIndex = Math.floor(Math.random() * pool.length);
  const targetItem = pool[targetIndex];
  const numItems = pool.length;
  const sliceAngle = (2 * Math.PI) / numItems;
  const targetSegmentCenter = (targetIndex + 0.5) * sliceAngle;
  const targetAngleAtTop = (1.5 * Math.PI) - targetSegmentCenter;
  const totalRotation = (2 * Math.PI * 5) + targetAngleAtTop;
  groupDraftState.spinning = true;
  groupDraftState.startTime = Date.now();
  groupDraftState.targetAngle = totalRotation;
  groupDraftState.duration = 4000;
  groupDraftState.lastDrawnItem = null;
  // Das Ergebnis steht schon fest (nur die Animation läuft noch) - wird hier IM
  // draftState (also in Firebase) gemerkt statt nur in einer lokalen JS-Variable. Sonst
  // bliebe das Rad für immer hängen, falls der Tab während der ~4s Animation neu lädt
  // oder in den Hintergrund gerät (z.B. Bildschirm sperrt sich) und der lokale
  // setTimeout dadurch verloren geht - der gemeldete "Rad dreht nicht mehr weiter"-Bug.
  groupDraftState.pendingTarget = targetItem;
  saveData();
  if (groupSpinTimeoutId) clearTimeout(groupSpinTimeoutId);
  groupSpinTimeoutId = setTimeout(() => {
    groupSpinTimeoutId = null;
    if (hasElevated() && groupDraftState.spinning) {
      applyGroupDraw(targetItem);
    }
  }, 4100);
}
// Admin/God kann die laufende Dreh-Animation überspringen - übernimmt sofort das
// schon feststehende Ergebnis (siehe skipWheelSpin() beim Team-Glücksrad, analog)
function skipGroupWheelSpin() {
  if (!hasElevated() || !groupDraftState.spinning || groupDraftState.pendingTarget == null) return;
  if (groupSpinTimeoutId) { clearTimeout(groupSpinTimeoutId); groupSpinTimeoutId = null; }
  applyGroupDraw(groupDraftState.pendingTarget);
}
// Übernimmt das gezogene Element (Team oder - im source='players'-Modus - direkt ein
// Spielername) und weist es der aktuellen Ziel-Gruppe zu; rückt die Ziel-Gruppe eins
// weiter (reihum A, B, C, ..., wieder A, ...)
function applyGroupDraw(itemName) {
  const isPlayers = groupDraftState.source === 'players';
  groupDraftState.spinning = false;
  groupDraftState.pendingTarget = null;
  groupDraftState.lastDrawnItem = itemName;
  const idx = groupDraftState.remainingTeams.indexOf(itemName);
  if (idx !== -1) groupDraftState.remainingTeams.splice(idx, 1);
  const letter = groupDraftState.groupLetters[groupDraftState.targetGroupIndex];
  if (!groupDraftState.assignments[letter]) groupDraftState.assignments[letter] = [];
  if (isPlayers) {
    groupDraftState.assignments[letter].push(itemName);
  } else {
    const team = teams.find(t => t.name === itemName);
    if (team) groupDraftState.assignments[letter].push(team.id);
  }
  groupDraftState.lastAssignedGroup = letter;
  groupDraftState.targetGroupIndex = (groupDraftState.targetGroupIndex + 1) % groupDraftState.groupLetters.length;
  saveData();
  renderGroupDraftStep();
}
// Baut die Anzeige für den aktuellen Gruppen-Auslosungs-Schritt auf
function renderGroupDraftStep() {
  const stage = document.getElementById('draft-stage');
  if (!stage) return;
  // Recovery: Die Animation sollte laut startTime/duration längst fertig sein, aber
  // spinning ist noch true (z.B. weil der lokale setTimeout durch einen Tab-Reload oder
  // Hintergrund-Drosselung verloren ging) - dann JETZT aus dem (in Firebase gespeicherten)
  // pendingTarget auflösen, statt für immer "spinning" hängen zu bleiben.
  if (hasElevated() && groupDraftState.spinning && groupDraftState.startTime && groupDraftState.pendingTarget != null) {
    const elapsed = Date.now() - groupDraftState.startTime;
    if (elapsed >= (groupDraftState.duration || 4000)) {
      if (groupSpinTimeoutId) { clearTimeout(groupSpinTimeoutId); groupSpinTimeoutId = null; }
      applyGroupDraw(groupDraftState.pendingTarget);
      return;
    }
  }
  const isPlayers = groupDraftState.source === 'players';
  const itemLabel = isPlayers ? 'Namen' : 'Team(s)';
  if (!groupDraftState.remainingTeams || groupDraftState.remainingTeams.length === 0) {
    stage.innerHTML = `
      <h3 style="color:#4CAF50; margin-bottom: 10px;">🎉 Alle ${isPlayers ? 'Namen wurden' : 'Teams wurden'} auf die Gruppen verteilt! 🎉</h3>
      ${hasElevated() ? `
        <button class="btn-primary role-btn" style="margin-top:15px;" onclick="finishGroupDraft()">
          💾 Gruppen speichern${isPlayers ? '' : ' & Spielplan erstellen'}
        </button>
      ` : '<p style="color:var(--fal-yellow);">Warte auf Admin-Bestätigung...</p>'}
      <button class="btn-secondary role-btn" style="margin-top:10px;" onclick="goToLandingPage()">🔄 Turnier wechseln</button>
    `;
    return;
  }
  const nextLetter = groupDraftState.groupLetters[groupDraftState.targetGroupIndex];
  stage.innerHTML = `
    <p style="font-size:0.9em; opacity:0.8;">Noch ${groupDraftState.remainingTeams.length} ${itemLabel} übrig</p>
    <h3 style="margin:5px 0; color:var(--fal-yellow);">🎰 Lose ${isPlayers ? 'Name' : 'Team'} für <strong>${nextLetter}</strong></h3>
    <div class="wheel-container" style="position:relative; width:260px; margin:0 auto;">
      <div class="wheel-pointer" style="position:absolute; top:-10px; left:50%; transform:translateX(-50%); width:0; height:0; border-left:10px solid transparent; border-right:10px solid transparent; border-top:15px solid red; z-index:10;"></div>
      <canvas id="wheel-canvas" width="260" height="260"></canvas>
    </div>
    <div id="spin-result" style="height: 35px; font-weight: bold; font-size: 1.1em; color: var(--fal-yellow); margin-top:5px;">
      ${groupDraftState.lastDrawnItem ? `🎯 <u>${groupDraftState.lastDrawnItem}</u> → ${groupDraftState.lastAssignedGroup}` : ''}
    </div>
    ${hasElevated() ? `
      <div style="margin-top:15px; display:flex; gap:10px; justify-content:center;">
        <button class="btn-secondary role-btn" style="background:#e74c3c; color:white; border:none;" onclick="cancelGroupDraft()">
          🛑 Abbrechen
        </button>
        ${!groupDraftState.spinning ? `
          <button class="btn-primary role-btn" id="btn-spin-group-wheel" onclick="spinGroupWheel()">
            🎰 Rad drehen
          </button>
        ` : ''}
        ${groupDraftState.spinning && groupDraftState.pendingTarget != null ? `
          <button class="btn-primary role-btn" onclick="skipGroupWheelSpin()">
            ⏭️ Überspringen
          </button>
        ` : ''}
      </div>
    ` : `
      <p style="font-size:0.9em; opacity:0.8; margin-top:10px;">
        ${groupDraftState.spinning ? '🎰 Das Rad dreht sich live...' : 'Der Admin dreht gleich am Rad!'}
      </p>
    `}
    <button class="btn-secondary role-btn" style="margin-top:10px;" onclick="goToLandingPage()">🔄 Turnier wechseln</button>
  `;
  startGroupWheelAnimationLoop();
}
// Startet die requestAnimationFrame-Schleife fürs Gruppen-Glücksrad (analog zum Team-Rad)
function startGroupWheelAnimationLoop() {
  if (animFrameId) cancelAnimationFrame(animFrameId);
  function animate() {
    if (!groupDraftState || !groupDraftState.active) return;
    let currentAngle = 0;
    if (groupDraftState.spinning && groupDraftState.startTime) {
      const elapsed = Date.now() - groupDraftState.startTime;
      const progress = Math.min(elapsed / (groupDraftState.duration || 4000), 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      currentAngle = (groupDraftState.targetAngle || 0) * easeOut;
      if (progress >= 1) {
        drawGroupWheelCanvas(groupDraftState.targetAngle);
        return;
      }
    } else {
      currentAngle = groupDraftState.targetAngle || 0;
    }
    drawGroupWheelCanvas(currentAngle);
    if (groupDraftState.spinning) {
      animFrameId = requestAnimationFrame(animate);
    }
  }
  animFrameId = requestAnimationFrame(animate);
}
// Zeichnet das Gruppen-Glücksrad (schlichter als das Team-Rad: keine Vereinswappen/-farben,
// nur abwechselnd Blau/Gelb mit dem Team-Namen)
function drawGroupWheelCanvas(angleOffset) {
  const canvas = document.getElementById('wheel-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const items = groupDraftState.remainingTeams;
  const numItems = items ? items.length : 0;
  ctx.clearRect(0, 0, 260, 260);
  if (numItems === 0) return;
  const centerX = 130, centerY = 130, radius = 130;
  const sliceAngle = (2 * Math.PI) / numItems;
  for (let i = 0; i < numItems; i++) {
    const startAngle = angleOffset + i * sliceAngle;
    const endAngle = startAngle + sliceAngle;
    const itemText = String(items[i]);
    const segmentColor = (i % 2 === 0) ? '#1b365d' : '#f1c40f';
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = segmentColor;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(startAngle + sliceAngle / 2);
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.font = "bold 13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif";
    const textColor = getReadableTextColor(segmentColor);
    const outlineColor = (textColor === '#ffffff') ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.65)';
    ctx.strokeStyle = outlineColor;
    ctx.lineWidth = 1.5;
    ctx.strokeText(itemText, radius - 35, 0);
    ctx.fillStyle = textColor;
    ctx.fillText(itemText, radius - 35, 0);
    ctx.restore();
  }
}
// Bricht die laufende Gruppen-Auslosung ab und setzt sie komplett zurück
function cancelGroupDraft() {
  if (!hasElevated()) return;
  if (confirm("Möchtest du die Gruppen-Auslosung wirklich abbrechen und zurücksetzen?")) {
    if (animFrameId) cancelAnimationFrame(animFrameId);
    if (groupSpinTimeoutId) { clearTimeout(groupSpinTimeoutId); groupSpinTimeoutId = null; }
    groupDraftState = { active: false, spinning: false, remainingTeams: [], groupLetters: [], targetGroupIndex: 0, assignments: {}, lastDrawnItem: null, lastAssignedGroup: null, startTime: null, targetAngle: 0, duration: 4000, pendingTarget: null };
    saveData();
    const modal = document.getElementById('draft-modal');
    if (modal) modal.style.display = 'none';
    renderAll();
    alert("Gruppen-Auslosung wurde zurückgesetzt!");
  }
}
// Übernimmt die fertig gelosten Gruppen und erstellt daraus den kompletten Spielplan
function finishGroupDraft() {
  if (!hasElevated()) return;
  const isPlayers = groupDraftState.source === 'players';
  if (isPlayers) {
    // "Nur Namen"-Modus (z.B. Zimmer-/Ausflugsauslosung): keine Teams/Vereine/Spielplan
    // beteiligt - members ist eine einfache Liste von Namen statt Team-IDs, siehe renderGroups().
    groups = groupDraftState.groupLetters.map(letter => ({ letter, members: groupDraftState.assignments[letter] || [] }));
    groupDraftState.active = false;
    saveData();
    renderAll();
    showTab('groups');
    alert('🎉 Gruppen wurden gespeichert!');
    return;
  }
  groups = groupDraftState.groupLetters.map(letter => ({ letter, teams: groupDraftState.assignments[letter] || [] }));
  groupDraftState.active = false;
  buildGroupScheduleAndSave();
  showTab('matches');
  alert('🎉 Gruppen wurden gespeichert & Spielplan erstellt!');
}
// ============================================================================
// 8b. KO-PHASE (generisch) — funktioniert für JEDE Gruppenanzahl und JEDE gewünschte
//     Teilnehmerzahl. Reicht die direkte Qualifikation (Top N je Gruppe) nicht glatt
//     auf die gewünschte Gesamtzahl, füllt ein automatischer Quervergleich (beste
//     Gruppendritte, ggf. -vierte, ...) den Rest auf (computeKOQualifiers). Ist die
//     Teilnehmerzahl keine Zweierpotenz, bekommen die bestplatzierten Team(s) ein
//     Freilos direkt in Runde 2 (buildKORound1Pairing/koByeTeamIds). Danach wird JEDE
//     weitere Runde per advanceKORound() aus den Siegern der vorigen Runde ausgelost -
//     eine einzige generische Funktion statt fixer Viertel-/Halbfinale/Finale-Schritte.
// ============================================================================
// Kleinste Zweierpotenz >= n (Bracket-Größe für die KO-Phase)
function nextPowerOf2(n) {
  let p = 1;
  while (p < n) p *= 2;
  return p;
}
// Liefert den deutschen Runden-Namen für die Anzahl Teams, die in diese Runde einziehen
function roundNameForSize(size) {
  if (size <= 2) return '🏆 FINALE';
  if (size === 4) return 'Halbfinale';
  if (size === 8) return 'Viertelfinale';
  if (size === 16) return 'Achtelfinale';
  if (size === 32) return 'Sechzehntelfinale';
  return `Runde der ${size}`;
}
// Ermittelt aus den Gruppentabellen die KO-Qualifikanten für eine gewünschte
// Gesamtzahl: pro Gruppe direkt die Top "perGroup" (= Ganzzahl-Anteil), reicht das
// nicht glatt auf, füllt ein Quervergleich der jeweils nächstplatzierten Teams
// (Gruppendritte bei perGroup=2, Gruppenvierte bei perGroup=3, usw.) den Rest auf.
function computeKOQualifiers(standings, totalQualifiers) {
  const numG = standings.length;
  const perGroup = Math.floor(totalQualifiers / numG);
  const wildcardsNeeded = totalQualifiers - perGroup * numG;
  const qualifiers = [];
  standings.forEach(g => {
    for (let i = 0; i < perGroup; i++) {
      const r = g.rankings[i];
      if (r && r.teamId !== undefined) qualifiers.push({ ...r, group: g.letter, rank: i + 1 });
    }
  });
  if (wildcardsNeeded > 0) {
    const candidatePool = standings
      .map(g => { const r = g.rankings[perGroup]; return (r && r.teamId !== undefined) ? { ...r, group: g.letter, rank: perGroup + 1 } : null; })
      .filter(Boolean)
      .sort((a, b) => b.points - a.points || b.diff - a.diff || b.gf - a.gf);
    candidatePool.slice(0, wildcardsNeeded).forEach(r => qualifiers.push(r));
  }
  return qualifiers;
}
// Baut die Runde-1-Paarungen aus den Qualifikanten: die bestplatzierten Team(s) bekommen
// bei Bedarf ein Freilos (siehe nextPowerOf2), der Rest wird zufällig gepaart, wobei ein
// direktes Rematch aus der Gruppenphase (gleiche Gruppe) nach Möglichkeit vermieden wird.
function buildKORound1Pairing(qualifiers) {
  const bracketSize = nextPowerOf2(qualifiers.length);
  const byeCount = bracketSize - qualifiers.length;
  const seeded = [...qualifiers].sort((a, b) => a.rank - b.rank || b.points - a.points || b.diff - a.diff || b.gf - a.gf);
  const byeTeams = seeded.slice(0, byeCount);
  const pool = seeded.slice(byeCount).sort(() => Math.random() - 0.5);
  const pairs = [];
  while (pool.length > 0) {
    const a = pool.shift();
    let idx = pool.findIndex(t => t.group !== a.group);
    if (idx === -1) idx = 0;
    const b = pool.splice(idx, 1)[0];
    pairs.push([a, b]);
  }
  return { byeTeams, pairs, bracketSize };
}
// Lost die nächste KO-Runde aus: beim allerersten Aufruf (noch keine KO-Spiele) wird die
// gewünschte Gesamt-Teilnehmerzahl abgefragt und Runde 1 aus der Gruppenphase gebildet.
// Danach lost jeder weitere Aufruf die jeweils nächste Runde aus den Siegern der zuletzt
// abgeschlossenen Runde aus - beim Übergang von 4 auf 2 Teams gleichzeitig auch das
// Spiel um Platz 3 aus den beiden Verlierern.
function advanceKORound() {
  if (!hasElevated()) return;
  if (koMatches.length === 0) {
    if (!groups || groups.length < 2) return alert('Bitte zuerst die Gruppenphase auslosen.');
    if (!groupMatches.every(m => m.played)) return alert('Es müssen zuerst alle Gruppenspiele eingetragen sein!');
    const standings = calculateGroupStandings();
    const maxPossible = standings.reduce((s, g) => s + g.rankings.length, 0);
    const defaultTotal = koQualifiersTotal || Math.min(numGroups * 2, maxPossible);
    const input = prompt(`Wie viele Teams sollen insgesamt in die KO-Runde einziehen? (${numGroups} Gruppen, max. ${maxPossible} Teams insgesamt)`, String(defaultTotal));
    if (input === null) return;
    const total = parseInt(input, 10);
    if (isNaN(total) || total < 2) return alert('Bitte eine Zahl ab 2 eingeben!');
    if (total > maxPossible) return alert(`Es gibt insgesamt nur ${maxPossible} Teams - so viele können nicht in die KO-Runde einziehen.`);
    const perGroup = Math.floor(total / numGroups);
    if (perGroup > 0 && standings.some(g => g.rankings.length < perGroup)) {
      return alert(`Mindestens eine Gruppe hat weniger als ${perGroup} Teams - bitte eine kleinere Gesamtzahl wählen.`);
    }
    const qualifiers = computeKOQualifiers(standings, total);
    if (qualifiers.length < 2) return alert('Zu wenige qualifizierte Teams für eine KO-Runde ermittelt.');
    if (qualifiers.length < total && !confirm(`Es konnten nur ${qualifiers.length} statt ${total} Teams ermittelt werden (nicht genug Kandidaten für den Quervergleich). Trotzdem mit ${qualifiers.length} Teams fortfahren?`)) return;
    koQualifiersTotal = total;
    const { byeTeams, pairs, bracketSize } = buildKORound1Pairing(qualifiers);
    koByeTeamIds = byeTeams.map(t => t.teamId);
    const roundName = roundNameForSize(bracketSize);
    const byeNote = byeTeams.length ? `\n\n${byeTeams.length} Team(s) haben ein Freilos direkt in die nächste Runde: ${byeTeams.map(t => t.name).join(', ')}` : '';
    if (!confirm(`${roundName} mit ${qualifiers.length} Teams auslosen?${byeNote}`)) return;
    koMatches = [];
    let matchId = 1;
    pairs.forEach((pair, i) => {
      const m = makeKOMatch(matchId++, roundName, (i % 2 === 0) ? 'Hauptplatz' : 'Nebenplatz', pair[0].teamId, pair[1].teamId);
      m.roundNumber = 0;
      koMatches.push(m);
    });
    assignScheduledTimes(koMatches, Date.now());
    saveData();
    showTab('matches');
    alert(`🎉 ${roundName} wurde ausgelost!${byeNote}`);
    return;
  }

  if (koMatches.some(m => m.round === '🏆 FINALE')) {
    return alert('Das Finale wurde bereits ausgelost - das Turnier ist damit komplett!');
  }
  const currentRoundNumber = Math.max(...koMatches.map(m => m.roundNumber || 0));
  const currentRoundMatches = koMatches.filter(m => (m.roundNumber || 0) === currentRoundNumber);
  if (!currentRoundMatches.every(m => m.played)) {
    return alert(`Es müssen zuerst alle Spiele der aktuellen Runde (${currentRoundMatches[0].round}) eingetragen sein!`);
  }
  const winners = currentRoundMatches.map(m => ({ teamId: m.score1 > m.score2 ? m.t1Id : m.t2Id }));
  const losers = currentRoundMatches.map(m => ({ teamId: m.score1 > m.score2 ? m.t2Id : m.t1Id }));
  const advancing = [...winners];
  if (currentRoundNumber === 0 && koByeTeamIds.length > 0) {
    koByeTeamIds.forEach(tid => advancing.push({ teamId: tid }));
    koByeTeamIds = [];
  }
  if (advancing.length < 2) return alert('Nicht genug Teams für eine weitere Runde übrig.');

  let matchId = Math.max(...koMatches.map(m => m.id)) + 1;
  if (advancing.length === 2) {
    if (!confirm('Finale & Spiel um Platz 3 jetzt erstellen?')) return;
    const newMatches = [];
    if (losers.length >= 2) {
      const m3 = makeKOMatch(matchId++, '🥉 Spiel um Platz 3', 'Nebenplatz', losers[0].teamId, losers[1].teamId);
      m3.roundNumber = currentRoundNumber + 1;
      newMatches.push(m3);
    }
    const mf = makeKOMatch(matchId++, '🏆 FINALE', 'Hauptplatz', advancing[0].teamId, advancing[1].teamId);
    mf.roundNumber = currentRoundNumber + 1;
    newMatches.push(mf);
    assignScheduledTimes(newMatches, Date.now());
    koMatches.push(...newMatches);
    saveData();
    showTab('matches');
    return;
  }

  const roundName = roundNameForSize(advancing.length);
  if (!confirm(`${roundName} jetzt aus den ${advancing.length} verbliebenen Teams auslosen?`)) return;
  const shuffled = [...advancing].sort(() => Math.random() - 0.5);
  const newMatches = [];
  for (let i = 0; i < shuffled.length; i += 2) {
    const m = makeKOMatch(matchId++, roundName, (newMatches.length % 2 === 0) ? 'Hauptplatz' : 'Nebenplatz', shuffled[i].teamId, shuffled[i + 1].teamId);
    m.roundNumber = currentRoundNumber + 1;
    newMatches.push(m);
  }
  assignScheduledTimes(newMatches, Date.now());
  koMatches.push(...newMatches);
  saveData();
  showTab('matches');
}
// Erstattet allen Spielern die Coins, die sie auf gelöschte Spiele gesetzt hatten,
// und entfernt diese Wetten danach (verhindert, dass Coins bei einem Reset "verschwinden")
function refundAndClearBets(isKO) {
  bets.filter(b => b.isKO === isKO).forEach(b => {
    userBalances[b.playerName] = (userBalances[b.playerName] || 0) + b.amount;
  });
  bets = bets.filter(b => b.isKO !== isKO);
}
// Setzt NUR die KO-Phase zurück (Viertelfinale/Halbfinale/Finale). Gruppenphase & Teams bleiben erhalten.
function resetKOPhase() {
  if (!hasElevated()) return;
  if (koMatches.length === 0) return alert('Es gibt aktuell keine KO-Phase zum Zurücksetzen.');
  if (!confirm('KO-Phase wirklich zurücksetzen? Alle KO-Runden werden gelöscht (offene Wetten darauf werden erstattet). Die Gruppenphase bleibt erhalten.')) return;
  koMatches = [];
  koByeTeamIds = [];
  refundAndClearBets(true);
  saveData();
  renderAll();
  alert('✅ KO-Phase wurde zurückgesetzt.');
}
// Setzt die Gruppenphase zurück (Gruppen + Gruppenspiele) und damit zwangsläufig auch die KO-Phase.
// Die Teams selbst bleiben erhalten, es wird nur neu in Gruppen gelost.
function resetGroupPhase() {
  if (!hasElevated()) return;
  if (groups.length === 0) return alert('Es gibt aktuell keine Gruppenphase zum Zurücksetzen.');
  if (!confirm('Gruppenphase wirklich zurücksetzen? Gruppen, Gruppenspiele UND die komplette KO-Phase werden gelöscht (offene Wetten werden erstattet). Die Teams bleiben erhalten.')) return;
  groups = [];
  groupMatches = [];
  koMatches = [];
  koByeTeamIds = [];
  refundAndClearBets(false);
  refundAndClearBets(true);
  saveData();
  renderAll();
  alert('✅ Gruppenphase wurde zurückgesetzt.');
}
// Setzt die komplette Team-Auslosung zurück (Teams, Gruppen, Spielplan, KO-Phase, Tipps).
// Die Spielerliste selbst bleibt erhalten - es wird nur neu in Teams gelost.
function resetTeamDraft() {
  if (!hasElevated()) return;
  if (teams.length === 0) return alert('Es gibt aktuell keine Teams zum Zurücksetzen.');
  if (!confirm('Team-Auslosung wirklich zurücksetzen? Teams, Gruppen, Spielplan, KO-Phase und alle Tipps werden gelöscht (offene Wetten/Tipps werden erstattet). Die Spielerliste bleibt erhalten.')) return;
  teams = [];
  groups = [];
  groupMatches = [];
  koMatches = [];
  numGroups = 3;
  koQualifiersTotal = null;
  koByeTeamIds = [];
  refundAndClearBets(false);
  refundAndClearBets(true);
  Object.keys(tips).forEach(name => {
    userBalances[name] = (userBalances[name] || 0) + tips[name].amount;
  });
  tips = {};
  tipsEvaluated = false;
  draftState = { active: false, currentStep: 0, tempP1: null, tempP2: null, remainingPlayers: [], remainingClubs: [], spinning: false, startTime: null, targetAngle: 0, duration: 4000, lastDrawnItem: null, pairs: [], pendingTarget: null };
  groupDraftState = { active: false, spinning: false, remainingTeams: [], groupLetters: [], targetGroupIndex: 0, assignments: {}, lastDrawnItem: null, lastAssignedGroup: null, startTime: null, targetAngle: 0, duration: 4000, pendingTarget: null };
  saveData();
  renderAll();
  alert('✅ Team-Auslosung wurde zurückgesetzt.');
}
// Setzt NUR das Wettsystem zurück (Wetten, Tipps, FAL-Coins-Kontostände) - alle
// starten wieder bei 100 Coins. Teams, Gruppen, Spielplan, Ergebnisse und die
// Spielerliste bleiben komplett unverändert.
function resetBettingSystem() {
  if (!hasElevated()) return;
  if (!confirm('Wettsystem wirklich zurücksetzen? Alle Wetten, Tipps und FAL-Coins-Kontostände werden gelöscht (jeder startet wieder bei 100 Coins). Teams, Gruppen und Spielergebnisse bleiben unverändert.')) return;
  bets = [];
  tips = {};
  tipsEvaluated = false;
  userBalances = {};
  groupMatches.forEach(m => { m.betsEvaluated = false; });
  koMatches.forEach(m => { m.betsEvaluated = false; });
  saveData();
  renderAll();
  alert('✅ Wettsystem wurde zurückgesetzt. Alle Spieler starten wieder mit 100 FAL-Coins.');
}
// Löscht nach Bestätigung das KOMPLETTE Turnier (Spieler, Teams, Ergebnisse, Coins, Wetten) - die "Nuklear-Option"
function resetTournament() {
  if (!hasElevated()) return;
  if (confirm('Turnier wirklich KOMPLETT zurücksetzen? Alle Spieler, Teams, Ergebnisse und Coins werden unwiderruflich gelöscht!')) {
    players = [];
    teams = [];
    numGroups = 3;
    groups = [];
    groupMatches = [];
    koMatches = [];
    tips = {};
    tipsEvaluated = false;
    registrationLocked = false;
    draftState = { active: false, currentStep: 0, tempP1: null, tempP2: null, remainingPlayers: [], remainingClubs: [], spinning: false, startTime: null, targetAngle: 0, duration: 4000, lastDrawnItem: null, pairs: [], pendingTarget: null };
    userBalances = {};
    bets = [];
    saveData();
  }
}
// ============================================================================
// 9. TEAM- & MATCH-UPDATES — Team-Namen ändern, Ergebnisse eintragen/bestätigen,
//    Spiele als "gestartet" markieren (schließt automatisch die Wetten dafür)
// ============================================================================
function updateTeamName(teamId, newName) {
  const team = teams.find(t => t.id === teamId);
  if (!team) return;
  const isMyTeam = (myPlayerName && (team.p1 === myPlayerName || team.p2 === myPlayerName));
  if (hasElevated() || isMyTeam) {
    team.name = newName.trim() || `Team ${team.id}`;
    saveData();
  } else {
    alert('Du kannst nur deinen eigenen Team-Namen bearbeiten!');
    renderAll();
  }
}
// Liefert je nach Phase entweder die KO-Spiele- oder die Gruppen-Spiele-Liste
function getMatchArray(isKO) { return isKO ? koMatches : groupMatches; }
// Spieler tragen ihr eigenes Ergebnis ein -> "vorläufig". Admin/Ref bestätigt separat.
function submitMatchResult(matchId, isKO) {
  const matchArray = getMatchArray(isKO);
  const match = matchArray.find(m => m.id === matchId);
  if (!match) return;
  const myTeam = getMyTeam();
  const canEdit = hasElevated() || (myTeam && (match.t1Id === myTeam.id || match.t2Id === myTeam.id));
  if (!canEdit) {
    alert('Du darfst nur Ergebnisse eintragen, bei denen dein Team mitspielt!');
    return;
  }
  if (match.confirmed && !hasElevated()) {
    alert('Dieses Ergebnis wurde bereits vom Admin bestätigt und ist gesperrt!');
    return;
  }
  const solo = tournamentMode === 'solo';
  const h1El = document.getElementById(`m_${matchId}_${isKO ? 'ko_' : ''}h1`);
  const h2El = document.getElementById(`m_${matchId}_${isKO ? 'ko_' : ''}h2`);
  const h1 = h1El ? h1El.value : '';
  const h2 = h2El ? h2El.value : '';
  // Solo-Modus: nur EIN Ergebnis-Feldpaar (kein Hin-/Rückspiel, jeder Spieler spielt selbst).
  if (solo) {
    if (h1 === '' || h2 === '') {
      if (hasElevated()) {
        match.score1_h = null; match.score2_h = null;
        match.score1 = null; match.score2 = null;
        match.played = false;
        saveData();
        renderAll();
      } else {
        alert('Bitte beide Ergebnis-Felder ausfüllen!');
      }
      return;
    }
    const s1 = parseInt(h1, 10), s2 = parseInt(h2, 10);
    if (isKO && s1 === s2) {
      return alert('In der KO-Phase muss es einen Sieger geben!');
    }
    match.score1_h = s1; match.score2_h = s2;
    match.score1 = s1; match.score2 = s2;
    match.played = true;
    saveData();
    renderAll();
    alert(match.confirmed ? '✅ Ergebnis korrigiert (Tabelle aktualisiert).' : '✅ Ergebnis vorläufig gespeichert. Ein Admin/Ref muss es noch bestätigen.');
    return;
  }
  const r1El = document.getElementById(`m_${matchId}_${isKO ? 'ko_' : ''}r1`);
  const r2El = document.getElementById(`m_${matchId}_${isKO ? 'ko_' : ''}r2`);
  const r1 = r1El ? r1El.value : '';
  const r2 = r2El ? r2El.value : '';
  if (h1 === '' || h2 === '' || r1 === '' || r2 === '') {
    if (hasElevated()) {
      match.score1_h = null; match.score2_h = null;
      match.score1_r = null; match.score2_r = null;
      match.score1 = null; match.score2 = null;
      match.played = false;
      saveData();
      renderAll();
    } else {
      alert('Bitte alle 4 Ergebnis-Felder (Hin- & Rückspiel) ausfüllen!');
    }
    return;
  }
  const s1h = parseInt(h1, 10), s2h = parseInt(h2, 10);
  const s1r = parseInt(r1, 10), s2r = parseInt(r2, 10);
  const total1 = s1h + s1r;
  const total2 = s2h + s2r;
  if (isKO && total1 === total2) {
    return alert('In der KO-Phase muss es nach Hin- und Rückspiel einen Gesamtsieger geben!');
  }
  match.score1_h = s1h; match.score2_h = s2h;
  match.score1_r = s1r; match.score2_r = s2r;
  match.score1 = total1; match.score2 = total2;
  match.played = true;
  saveData();
  renderAll();
  alert(match.confirmed ? '✅ Ergebnis korrigiert (Tabelle aktualisiert).' : '✅ Ergebnis vorläufig gespeichert. Ein Admin/Ref muss es noch bestätigen.');
}
// Admin/Ref bestätigt ein Ergebnis endgültig -> Wetten werden ausgezahlt
function confirmMatchResult(matchId, isKO) {
  if (!hasElevated()) return;
  const matchArray = getMatchArray(isKO);
  const match = matchArray.find(m => m.id === matchId);
  if (!match) return;
  if (!match.played) return alert('Es wurde noch kein Ergebnis eingetragen!');
  if (match.confirmed) return;
  match.confirmed = true;
  const winningTeamId = match.score1 > match.score2 ? match.t1Id : (match.score2 > match.score1 ? match.t2Id : null);
  if (winningTeamId) {
    evaluateBetsForMatch(matchId, isKO, winningTeamId);
    if (isKO && match.round === '🏆 FINALE') {
      evaluateTips(winningTeamId);
      const winnerTeam = teams.find(t => t.id === winningTeamId);
      if (winnerTeam) {
        setTimeout(() => {
          const winnerNames = tournamentMode === 'solo' ? winnerTeam.p1 : `${winnerTeam.p1} & ${winnerTeam.p2}`;
          alert(`🎉 🏆 DIE SIEGER DES FAL FIFA TURNIERS SIND: 🏆 🎉\n\n🥇 ${winnerNames} (${winnerTeam.name} - ${winnerTeam.club || ''}) 🥇\n\nHerzlichen Glückwunsch! 👏🥳`);
        }, 300);
      }
    }
  } else {
    saveData();
  }
  renderAll();
}
// Admin/Ref markiert ein Spiel als "gestartet". Ab diesem Zeitpunkt kann
// niemand mehr auf dieses Spiel wetten (siehe placeBet & renderBettingSystem).
function markMatchStarted(matchId, isKO) {
  if (!hasElevated()) return;
  const matchArray = getMatchArray(isKO);
  const match = matchArray.find(m => m.id === matchId);
  if (!match) return;
  if (match.started) return;
  if (!confirm('Spiel jetzt als gestartet markieren? Ab sofort kann niemand mehr darauf wetten.')) return;
  match.started = true;
  match.scheduledTime = Date.now(); // tatsächlicher Startzeitpunkt statt geplanter Zeit
  rescheduleFollowingMatches(matchArray, match); // gleicht den restlichen Zeitplan an (Verspätung/Vorsprung)
  saveData();
  renderAll();
}
// ============================================================================
// 10. RENDER PANEL & UI — baut aus dem aktuellen Zustand (Abschnitt 2) die komplette
//     sichtbare Seite zusammen. renderAll() ruft alle Einzel-Render-Funktionen auf
//     und wird nach JEDER Datenänderung neu ausgeführt.
// ============================================================================
function renderAll() {
  renderUserBadge();
  renderHome();
  renderTeams();
  renderGroups();
  renderMatches();
  renderAdminPanel();
  renderBettingSystem();
}
// ---- 10a. HOME-TAB: Regeln, Tippspiel, Dashboard ----
function renderHome() {
  renderMyOverview();
  renderRules();
  renderTipRound();
  renderDashboard();
}
// Findet heraus, welches konkrete Hin-/Rückspiel-"Bein" ein Spieler in einem Match
// persönlich bestreitet (Team1.p1 spielt immer Hinspiel, Team1.p2 immer Rückspiel -
// gegen wen genau aus Team2 hängt vom "crossed"-Flag ab, siehe renderMatchBlock).
// Gibt null zurück, falls der Spieler in diesem Match gar nicht selbst spielt.
function getMatchLegForPlayer(m, playerName) {
  const t1 = teams.find(t => t.id === m.t1Id);
  const t2 = teams.find(t => t.id === m.t2Id);
  if (!t1 || !t2) return null;
  const solo = tournamentMode === 'solo';
  const hinP1 = t1.p1, hinP2 = m.crossed ? t2.p2 : t2.p1;
  const rueckP1 = t1.p2, rueckP2 = m.crossed ? t2.p1 : t2.p2;
  if (playerName === hinP1) return { legName: solo ? null : 'Hinspiel', me: hinP1, opponent: hinP2 };
  if (playerName === hinP2) return { legName: solo ? null : 'Hinspiel', me: hinP2, opponent: hinP1 };
  if (playerName === rueckP1) return { legName: 'Rückspiel', me: rueckP1, opponent: rueckP2 };
  if (playerName === rueckP2) return { legName: 'Rückspiel', me: rueckP2, opponent: rueckP1 };
  return null;
}
// Sucht das nächste noch nicht gespielte Spiel des eigenen Teams (nach geplanter
// Uhrzeit sortiert), inkl. welches Bein man selbst spielt und gegen wen
function getMyNextMatchInfo() {
  if (!myPlayerName) return null;
  const myTeam = getMyTeam();
  if (!myTeam) return null;
  const upcoming = [
    ...groupMatches.map(m => ({ ...m, isKO: false })),
    ...koMatches.map(m => ({ ...m, isKO: true }))
  ].filter(m => !m.played && m.t1Id && m.t2Id && (m.t1Id === myTeam.id || m.t2Id === myTeam.id));
  if (upcoming.length === 0) return null;
  upcoming.sort((a, b) => (a.scheduledTime || Infinity) - (b.scheduledTime || Infinity));
  const match = upcoming[0];
  const opponentTeam = teams.find(t => t.id === (match.t1Id === myTeam.id ? match.t2Id : match.t1Id));
  return { match, leg: getMatchLegForPlayer(match, myPlayerName), opponentTeam, myTeam };
}
// Zeigt die persönliche "Wie sieht's bei mir aus?"-Übersicht ganz oben im Home-Tab:
// eigenes Team + nächstes anstehendes Spiel mit Uhrzeit, Platz und persönlichem Gegner
function renderMyOverview() {
  const container = document.getElementById('my-overview-content');
  if (!container) return;
  if (!myPlayerName) { container.innerHTML = ''; return; }
  const myTeam = getMyTeam();
  if (!myTeam) { container.innerHTML = ''; return; }
  const info = getMyNextMatchInfo();
  container.innerHTML = `
    <div class="admin-card" style="border-left: 4px solid var(--fal-yellow);">
      <p style="margin:0 0 8px 0;">📍 Dein Team: <strong>${escapeHtml(myTeam.name)}</strong> ${myTeam.club ? renderClubNameWithBadge(myTeam.club) : ''}</p>
      ${info ? `
        <div style="background:rgba(0,0,0,0.2); border-radius:8px; padding:10px;">
          <div style="font-size:0.85em; opacity:0.8;">${info.match.isKO ? info.match.round : info.match.group} • gegen ${escapeHtml(info.opponentTeam ? info.opponentTeam.name : '?')}</div>
          <div style="font-weight:bold; margin-top:2px;">🕐 ${formatMatchTime(info.match.scheduledTime) || 'Zeit noch offen'} · ${escapeHtml(info.match.court || '')}</div>
          ${info.leg ? `<div style="margin-top:4px; font-size:0.9em;">${info.leg.legName ? escapeHtml(info.leg.legName) + ': ' : ''}<strong>Du</strong> vs. <strong>${escapeHtml(info.leg.opponent)}</strong></div>` : ''}
          ${info.match.started ? '<div style="margin-top:4px; font-size:0.85em; color:var(--fal-red);">🚦 Läuft bereits!</div>' : ''}
        </div>
      ` : '<p style="margin:0; opacity:0.75; font-size:0.9em;">Aktuell kein anstehendes Spiel für dich.</p>'}
    </div>
  `;
}
// Zeigt die Turnierregeln (Admin/Ref sehen ein Bearbeitungsfeld, alle anderen nur den Text)
function renderRules() {
  const container = document.getElementById('rules-content');
  if (!container) return;
  if (hasElevated()) {
    const currentText = (rules === DEFAULT_RULES) ? '' : rules;
    container.innerHTML = `
      <textarea id="rules-textarea" rows="6" style="width:100%;" placeholder="Regeln hier eintragen...">${currentText}</textarea>
      <button class="btn-primary btn-sm" style="margin-top:8px;" onclick="saveRules()">Regeln speichern</button>
    `;
  } else {
    container.innerHTML = `<p class="rules-text">${rules}</p>`;
  }
}
// Speichert den vom Admin/Ref eingegebenen Regeltext
function saveRules() {
  if (!hasElevated()) return;
  const textarea = document.getElementById('rules-textarea');
  if (!textarea) return;
  rules = textarea.value.trim() || DEFAULT_RULES;
  saveData();
}
// ---- 10b. TIPPSPIEL (mit FAL-Coins, Quote = Anzahl Teams : 1, einmalig & fix) ----
function renderTipRound() {
  const container = document.getElementById('tip-content');
  if (!container) return;
  if (teams.length === 0) {
    container.innerHTML = '<p class="empty-state">Sobald die Teams gelost sind, kann getippt werden.</p>';
    return;
  }
  if (!myPlayerName) {
    container.innerHTML = '<p class="empty-state">Melde dich als Spieler an, um mitzutippen.</p>';
    return;
  }
  const myTip = tips[myPlayerName];
  const odds = teams.length;
  const finished = isTournamentFinished();
  if (myTip) {
    const tipTeam = teams.find(t => t.id === myTip.teamId);
    container.innerHTML = `
      <div class="bet-card">
        ✅ Du hast <strong>${myTip.amount} Coins</strong> ${coinIcon(14)} auf <strong>${tipTeam ? tipTeam.name : '???'}</strong>${tipTeam && tipTeam.club ? ' (' + tipTeam.club + ')' : ''} gesetzt.
        <div style="font-size:0.85em; opacity:0.75; margin-top:6px;">Quote ${odds}:1 – dein Tipp ist fix und kann nicht mehr geändert werden.</div>
      </div>
      ${finished ? renderTipResultsBreakdown() : '<p style="font-size:0.85em; opacity:0.7;">Die Tipps der anderen werden erst nach dem Finale sichtbar.</p>'}
    `;
    return;
  }
  if (hasTournamentStarted()) {
    container.innerHTML = '<p class="empty-state">🔒 Das Tippspiel ist geschlossen – das erste Spiel hat bereits begonnen.</p>';
    return;
  }
  const currentBalance = getUserBalance(myPlayerName);
  const options = teams.map(t => `<option value="${t.id}">${t.name}${t.club ? ' (' + t.club + ')' : ''}</option>`).join('');
  container.innerHTML = `
    <div class="bet-card">
      <div style="font-size:0.9em; margin-bottom:6px;">Aktuelle Quote: <strong style="color:var(--fal-yellow);">${odds}:1</strong> (bei ${teams.length} Teams)</div>
      <div class="bet-input-row">
        <select id="tip-team-select">${options}</select>
        <input type="number" id="tip-amount-input" placeholder="Coins" min="1" max="${currentBalance}">
        <button class="btn-primary" onclick="submitTip()">Tipp abgeben</button>
      </div>
      <div style="font-size:0.8em; opacity:0.7; margin-top:6px;">Dein Kontostand: ${currentBalance} Coins ${coinIcon(14)} — Achtung: Der Tipp kann danach nicht mehr geändert werden!</div>
    </div>
  `;
}
// Zeigt nach Turnierende, wie sich die Tipps aller Spieler auf die Teams verteilt haben
function renderTipResultsBreakdown() {
  const totalTips = Object.keys(tips).length;
  const rows = teams.map(t => {
    const count = Object.values(tips).filter(tip => tip.teamId === t.id).length;
    const pct = totalTips > 0 ? Math.round((count / totalTips) * 100) : 0;
    return `
      <div class="tip-row">
        <div class="tip-btn"><span>${t.name}</span><span style="color:var(--fal-yellow); font-weight:bold;">${pct}% (${count})</span></div>
        <div class="tip-bar-track"><div class="tip-bar-fill" style="width:${pct}%;"></div></div>
      </div>
    `;
  }).join('');
  return `<div style="margin-top:12px;">${rows}<p style="font-size:0.8em; opacity:0.7;">${totalTips} von ${players.length} Spielern haben getippt.</p></div>`;
}
// Spieler gibt seinen einmaligen, festen Tipp auf den Turniersieger ab
function submitTip() {
  if (!myPlayerName) return;
  if (tips[myPlayerName]) return alert('Du hast bereits getippt – das kann nicht mehr geändert werden.');
  if (hasTournamentStarted()) return alert('🔒 Das Tippspiel ist geschlossen – das erste Spiel hat bereits begonnen.');
  const teamSelect = document.getElementById('tip-team-select');
  const amountInput = document.getElementById('tip-amount-input');
  if (!teamSelect || !amountInput) return;
  const teamId = parseInt(teamSelect.value);
  const amount = parseInt(amountInput.value);
  const currentBalance = getUserBalance(myPlayerName);
  if (isNaN(amount) || amount <= 0) return alert('Bitte einen gültigen Betrag eingeben!');
  if (amount > currentBalance) return alert('Du hast nicht genügend FAL-Coins!');
  if (!confirm(`Sicher? Du setzt ${amount} Coins fest auf dieses Team – das lässt sich NICHT mehr ändern.`)) return;
  userBalances[myPlayerName] -= amount;
  tips[myPlayerName] = { teamId, amount };
  saveData();
}
// Zahlt nach Bestätigung des Finales allen richtig getippten Spielern ihren Gewinn aus
function evaluateTips(winningTeamId) {
  if (tipsEvaluated) return;
  const odds = teams.length || 1;
  Object.keys(tips).forEach(playerName => {
    const tip = tips[playerName];
    if (tip.teamId === winningTeamId) {
      const winAmount = tip.amount * odds;
      userBalances[playerName] = (userBalances[playerName] || 0) + winAmount;
    }
  });
  tipsEvaluated = true;
  saveData();
}
// ---- 10c. DASHBOARD (Einzelspieler-Statistiken) ----
function calculatePlayerStats() {
  const stats = {};
  function ensure(name) {
    if (!stats[name]) stats[name] = { name, goals: 0, conceded: 0, wins: 0, played: 0 };
    return stats[name];
  }
  function processLeg(m, isHin) {
    const s1 = isHin ? m.score1_h : m.score1_r;
    const s2 = isHin ? m.score2_h : m.score2_r;
    if (s1 === null || s1 === undefined || s2 === null || s2 === undefined) return;
    const t1 = teams.find(t => t.id === m.t1Id);
    const t2 = teams.find(t => t.id === m.t2Id);
    if (!t1 || !t2) return;
    const playerA = isHin ? t1.p1 : t1.p2;
    const playerB = isHin ? (m.crossed ? t2.p2 : t2.p1) : (m.crossed ? t2.p1 : t2.p2);
    const a = ensure(playerA);
    const b = ensure(playerB);
    a.goals += s1; a.conceded += s2; a.played++;
    b.goals += s2; b.conceded += s1; b.played++;
    if (s1 > s2) a.wins++;
    else if (s2 > s1) b.wins++;
  }
  [...groupMatches, ...koMatches].forEach(m => {
    processLeg(m, true);
    processLeg(m, false);
  });
  return Object.values(stats);
}
// Zeigt Live-Statistik-Kacheln: Torschützenkönig, beste Abwehr, höchste Siegquote, Fan-Liebling
// Zeigt eine Kachel mit den eigenen Wetten auf aktuell laufende (vom Admin/Ref
// als "gestartet" markierte, aber noch nicht ausgewertete) Spiele - inkl. Team,
// auf das gesetzt wurde. So sieht man auf dem Dashboard sofort: "Wo hab ich grad Geld drauf?"
function renderLiveBetsTile() {
  if (!myPlayerName) return '';
  const liveMatches = [
    ...groupMatches.map(m => ({ ...m, isKO: false })),
    ...koMatches.map(m => ({ ...m, isKO: true }))
  ].filter(m => m.started && !m.betsEvaluated);
  const myLiveBets = liveMatches
    .map(m => ({ match: m, bet: bets.find(b => b.matchId === m.id && b.isKO === m.isKO && b.playerName === myPlayerName) }))
    .filter(x => x.bet);
  if (myLiveBets.length === 0) return '';
  const rows = myLiveBets.map(({ match, bet }) => {
    const t1 = teams.find(t => t.id === match.t1Id);
    const t2 = teams.find(t => t.id === match.t2Id);
    const chosenTeam = teams.find(t => t.id === bet.chosenTeamId);
    return `
      <div style="padding:8px 0; border-bottom:1px solid rgba(255,255,255,0.08);">
        <div style="font-size:0.8em; opacity:0.7;">${match.isKO ? match.round : match.group} • 🔴 Läuft gerade</div>
        <div style="font-size:0.9em;">${t1 ? t1.name : '?'} vs ${t2 ? t2.name : '?'}</div>
        <div style="font-size:0.9em; margin-top:2px;">Deine Wette: <strong style="color:var(--fal-yellow);">${bet.amount} Coins</strong> ${coinIcon(14)} auf <strong>${chosenTeam ? chosenTeam.name : '?'}</strong></div>
      </div>
    `;
  }).join('');
  return `
    <div class="admin-card" style="border: 1px solid var(--fal-red); grid-column: 1 / -1;">
      <p class="stat-label" style="color:var(--fal-red); margin-bottom:4px;">🔴 Laufende Spiele mit deiner Wette</p>
      ${rows}
    </div>
  `;
}
function renderDashboard() {
  const container = document.getElementById('dashboard-content');
  if (!container) return;
  if (teams.length === 0) {
    container.innerHTML = '<p class="empty-state">Sobald Teams und Spiele existieren, siehst du hier Live-Statistiken.</p>';
    return;
  }
  const stats = calculatePlayerStats();
  const played = stats.filter(s => s.played > 0);
  const topScorer = played.length ? [...played].sort((a, b) => b.goals - a.goals)[0] : null;
  const bestDefender = played.length ? [...played].sort((a, b) => (a.conceded / a.played) - (b.conceded / b.played))[0] : null;
  const topWinner = played.length ? [...played].sort((a, b) => (b.wins / b.played) - (a.wins / a.played) || b.wins - a.wins)[0] : null;
  let favoriteTile = '';
  if (isTournamentFinished()) {
    const tipCounts = teams.map(t => ({ team: t, count: Object.values(tips).filter(tip => tip.teamId === t.id).length }));
    const favorite = [...tipCounts].sort((a, b) => b.count - a.count)[0];
    favoriteTile = `
      <div class="admin-card stat-tile">
        <p class="stat-label">🐐 Fan-Liebling (Tippspiel)</p>
        <p class="stat-value">${favorite && favorite.count > 0 ? `${favorite.team.name} (${favorite.count} Tipps)` : 'Keine Tipps'}</p>
      </div>
    `;
  }
  const wrappedTeaser = (isTournamentFinished() && myPlayerName) ? `
    <div class="admin-card wrapped-teaser" style="grid-column: 1 / -1;">
      <div>
        <p style="font-weight:bold; font-size:1.05em; margin:0 0 2px 0;">🎁 Dein Turnier-Wrapped ist da!</p>
        <p style="font-size:0.85em; opacity:0.85; margin:0;">Deine persönliche Bilanz aus diesem Turnier - Tore, bester Sieg, Coins & mehr.</p>
      </div>
      <button class="btn-primary" onclick="openWrapped()">Jetzt ansehen</button>
    </div>
  ` : '';
  container.innerHTML = `
    <div class="grid-container">
      ${wrappedTeaser}
      ${renderLiveBetsTile()}
      <div class="admin-card stat-tile">
        <p class="stat-label">⚽ Torschützenkönig</p>
        <p class="stat-value">${topScorer && topScorer.goals > 0 ? `${topScorer.name} (${topScorer.goals} Tore)` : 'Noch keine Tore'}</p>
      </div>
      <div class="admin-card stat-tile">
        <p class="stat-label">🛡️ Beste Abwehr</p>
        <p class="stat-value">${bestDefender ? `${bestDefender.name} (Ø ${(bestDefender.conceded / bestDefender.played).toFixed(1)} Gegentore)` : 'Noch keine Spiele'}</p>
      </div>
      <div class="admin-card stat-tile">
        <p class="stat-label">🔥 Höchste Siegquote</p>
        <p class="stat-value">${topWinner ? `${topWinner.name} (${topWinner.wins}/${topWinner.played} Siege)` : 'Noch keine Spiele'}</p>
      </div>
      ${favoriteTile}
    </div>
  `;
}
// Zeigt alle gelosten Teams inkl. Vereinswappen und Mitgliedern im Teams-Tab
function renderTeams() {
  const container = document.getElementById('teams-container');
  if (!container) return;

  if (teams.length === 0) {
    container.innerHTML = '<p class="empty-state">Noch keine Teams gelost. Gehe in den Admin-Bereich und starte die Auslosungs-Show.</p>';
    return;
  }
  container.innerHTML = teams.map(t => {
    const isMyTeam = (myPlayerName && (t.p1 === myPlayerName || t.p2 === myPlayerName));
    const canEditName = hasElevated() || isMyTeam;
    const canEditPhoto = canEditTeamPhoto(t);
    // Zeigt entweder das Vereinswappen (mit Namen) oder, falls eingestellt, das eigene Team-Foto
    const usingPhoto = t.displayMode === 'photo' && !!t.photo;
    const crestHtml = usingPhoto
      ? `<img src="${t.photo}" alt="Team-Foto" style="width:44px; height:44px; object-fit:cover; border-radius:50%; border:2px solid var(--fal-yellow);">`
      : (t.club ? `<div class="club-badge">${renderClubNameWithBadge(t.club)}</div>` : '');

    return `
      <div class="admin-card ${isMyTeam ? 'highlight-me' : ''}">
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap;">
          <input type="text" value="${t.name}"
                 ${canEditName ? '' : 'disabled'}
                 onchange="updateTeamName(${t.id}, this.value)"
                 style="font-weight: bold; font-size: 1.1em; max-width: 180px;">
          ${crestHtml}
        </div>
        ${isMyTeam ? '<div style="color:var(--fal-yellow); font-size:0.85em; font-weight:bold; margin-top:4px;">⭐ (Dein Team)</div>' : ''}
        <p style="margin-top: 8px; margin-bottom:0;">${t.p2 ? `Mitglieder: <strong>${t.p1}</strong> & <strong>${t.p2}</strong>` : `Spieler: <strong>${t.p1}</strong>`}</p>
        ${canEditPhoto ? `
          <div style="margin-top:8px; padding-top:8px; border-top:1px solid rgba(255,255,255,0.08); display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
            <button class="btn-secondary btn-sm" onclick="triggerTeamPhotoUpload(${t.id})">📷 ${t.photo ? 'Neues Team-Foto' : 'Team-Foto hochladen'}</button>
            ${t.photo ? `
              <label style="font-size:0.8em; display:flex; align-items:center; gap:4px;">
                <input type="radio" name="team-display-${t.id}" ${!usingPhoto ? 'checked' : ''} onchange="setTeamDisplayMode(${t.id}, 'club')"> Wappen
              </label>
              <label style="font-size:0.8em; display:flex; align-items:center; gap:4px;">
                <input type="radio" name="team-display-${t.id}" ${usingPhoto ? 'checked' : ''} onchange="setTeamDisplayMode(${t.id}, 'photo')"> Foto
              </label>
            ` : ''}
          </div>
        ` : ''}
      </div>
    `;
  }).join('');
}
// GRUPPENTABELLEN BERECHNUNG (Aggregat aus Hin- & Rückspiel)
function calculateGroupStandings() {
  return groups.map(g => {
    const stats = {};
    g.teams.forEach(tId => {
      const teamObj = teams.find(t => t.id === tId);
      const displayName = teamObj ? teamObj.name : `Team ${tId}`;
      stats[tId] = { teamId: tId, name: displayName, club: teamObj ? teamObj.club : '', played: 0, gf: 0, ga: 0, diff: 0, points: 0 };
    });
    groupMatches.filter(m => m.group === g.letter && m.played).forEach(m => {
      const t1 = stats[m.t1Id];
      const t2 = stats[m.t2Id];
      if (!t1 || !t2) return;
      t1.played++; t2.played++;
      t1.gf += m.score1; t1.ga += m.score2;
      t2.gf += m.score2; t2.ga += m.score1;
      if (m.score1 > m.score2) t1.points += 3;
      else if (m.score2 > m.score1) t2.points += 3;
      else { t1.points += 1; t2.points += 1; }
      t1.diff = t1.gf - t1.ga;
      t2.diff = t2.gf - t2.ga;
    });
    const rankings = Object.values(stats).sort((a, b) => b.points - a.points || b.diff - a.diff || b.gf - a.gf);
    return { letter: g.letter, rankings };
  });
}
// Deutsches Ordnungszahl-Wort für den Quervergleich ("Dritten", "Vierten", ...)
function germanOrdinalWord(n) {
  const words = { 1: 'Ersten', 2: 'Zweiten', 3: 'Dritten', 4: 'Vierten', 5: 'Fünften', 6: 'Sechsten', 7: 'Siebten', 8: 'Achten', 9: 'Neunten', 10: 'Zehnten' };
  return words[n] || `${n}.-Platzierten`;
}
// Zeigt die Gruppentabellen an, inkl. generischem Quervergleich (siehe computeKOQualifiers) -
// erscheint automatisch, sobald die gewählte KO-Teilnehmerzahl nicht glatt auf alle Gruppen
// aufgeht und darum ein Vergleich der jeweils nächstplatzierten Teams nötig ist.
function renderGroups() {
  const container = document.getElementById('groups-container');
  if (!container) return;
  if (groups.length === 0) {
    container.innerHTML = '<p class="empty-state">Noch keine Gruppen gelost.</p>';
    return;
  }
  // "Nur Namen"-Modus (siehe startGroupDraft(source='players')/finishGroupDraft): einfache
  // Namenslisten statt Team-Tabellen, kein Spielplan/Quervergleich - z.B. für Zimmer-/
  // Ausflugsauslosungen ganz ohne Fußball-Bezug.
  if (groups[0] && groups[0].members !== undefined) {
    container.innerHTML = groups.map(g => `
      <div class="admin-card">
        <h3 style="color:var(--fal-yellow); margin-top:0;">Gruppe ${g.letter}</h3>
        <ul style="margin:0; padding-left:20px;">
          ${g.members.map(name => `<li>${escapeHtml(name)}</li>`).join('') || '<li style="opacity:0.6;">leer</li>'}
        </ul>
      </div>
    `).join('');
    return;
  }
  const standings = calculateGroupStandings();
  const scoreColLabel = tournamentSport === 'darts' ? 'Sätze' : 'Tore';
  let html = standings.map(g => `
    <div class="admin-card">
      <h3 style="color:var(--fal-yellow); margin-top:0;">Gruppe ${g.letter}</h3>
      <div class="table-container">
        <table>
          <thead>
            <tr><th>#</th><th>Team</th><th>Sp</th><th>${scoreColLabel}</th><th>Diff</th><th>Pkt</th></tr>
          </thead>
          <tbody>
            ${g.rankings.map((r, idx) => `
              <tr>
                <td>${idx + 1}</td>
                <td>${teamCrestImg(teams.find(t => t.id === r.teamId), 20)}<strong>${escapeHtml(r.name)}</strong></td>
                <td>${r.played}</td>
                <td>${r.gf}:${r.ga}</td>
                <td>${r.diff > 0 ? '+' + r.diff : r.diff}</td>
                <td><strong>${r.points}</strong></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `).join('');
  const numG = standings.length;
  if (koQualifiersTotal && numG > 0) {
    const perGroup = Math.floor(koQualifiersTotal / numG);
    const wildcards = koQualifiersTotal - perGroup * numG;
    if (wildcards > 0) {
      const candidatePool = standings
        .map(g => { const r = g.rankings[perGroup]; return (r && r.teamId !== undefined) ? { ...r, group: g.letter } : null; })
        .filter(Boolean)
        .sort((a, b) => b.points - a.points || b.diff - a.diff || b.gf - a.gf);
      const ordinalWord = germanOrdinalWord(perGroup + 1);
      html += `
        <div class="admin-card highlight-me" style="grid-column: 1 / -1; margin-top: 10px;">
          <h3 style="color:var(--fal-yellow); margin-top:0;">📊 Quervergleich der Gruppen-${ordinalWord} (${wildcards} kommen zusätzlich weiter)</h3>
          <div class="table-container">
            <table>
              <thead><tr><th>Platz</th><th>Team (Gruppe)</th><th>Sp</th><th>${scoreColLabel}</th><th>Diff</th><th>Pkt</th><th>Status</th></tr></thead>
              <tbody>
                ${candidatePool.map((r, idx) => `
                  <tr style="${idx < wildcards ? 'background: rgba(0, 255, 100, 0.1);' : 'background: rgba(255, 0, 0, 0.1);'}">
                    <td>${idx + 1}</td>
                    <td>${teamCrestImg(teams.find(t => t.id === r.teamId), 20)}<strong>${escapeHtml(r.name)}</strong> (${escapeHtml(r.group)})</td>
                    <td>${r.played}</td>
                    <td>${r.gf}:${r.ga}</td>
                    <td>${r.diff > 0 ? '+' + r.diff : r.diff}</td>
                    <td><strong>${r.points}</strong></td>
                    <td>${idx < wildcards ? '✅ Qualifiziert' : '❌ Ausgeschieden'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }
  }
  container.innerHTML = html;
}
// SPIELE: gemeinsame Karten-Darstellung für Gruppen- & KO-Spiele
function renderMatchBlock(m, isKO) {
  const t1 = teams.find(t => t.id === m.t1Id) || { name: 'Team ?', p1: 'P1', p2: 'P2', club: '' };
  const t2 = teams.find(t => t.id === m.t2Id) || { name: 'Team ?', p1: 'P1', p2: 'P2', club: '' };
  const solo = tournamentMode === 'solo';
  const hinP2 = m.crossed ? t2.p2 : t2.p1;
  const rueckP2 = m.crossed ? t2.p1 : t2.p2;
  const myTeam = getMyTeam();
  const canEdit = hasElevated() || (myTeam && (m.t1Id === myTeam.id || m.t2Id === myTeam.id));
  const locked = m.confirmed && !hasElevated();
  
  let statusBadge = '<span class="status-badge status-open">❌ Offen</span>';
  if (m.betsEvaluated) statusBadge = '<span class="status-badge status-confirmed">🔒 Bestätigt & Ausgezahlt</span>';
  else if (m.confirmed) statusBadge = '<span class="status-badge status-confirmed">✅ Bestätigt</span>';
  else if (m.played) statusBadge = '<span class="status-badge status-provisional">⏳ Vorläufig</span>';
  else if (m.started) statusBadge = '<span class="status-badge" style="background:rgba(255,77,77,0.2); color:var(--fal-red); border:1px solid var(--fal-red);">🚦 Läuft (Wetten geschlossen)</span>';
  
  const prefix = `m_${m.id}_${isKO ? 'ko_' : ''}`;
  const courtColor = m.court === 'Hauptplatz' ? '#e74c3c' : '#2ecc71';
  const roundLabel = isKO ? m.round : `Runde ${m.slot || ''} • ${m.group}`;
  const timeLabel = m.scheduledTime ? `🕐 ${formatMatchTime(m.scheduledTime)}` : '';
  const hinLegColor = 'border-left: 5px solid #f1c40f; background: rgba(241, 196, 15, 0.1);';
  const rueckLegColor = 'border-left: 5px solid #3498db; background: rgba(52, 152, 219, 0.1);';

  return `
    <div class="match-card" style="position:relative;">
      <div style="display:flex; justify-content: space-between; align-items:center; flex-wrap:wrap; gap:6px;">
        <span style="color:var(--fal-yellow); font-weight:bold;">${roundLabel}</span>
        <div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap;">
          ${statusBadge}
          ${timeLabel ? `<span class="court-badge" style="background:rgba(255,255,255,0.12); color:#fff;">${timeLabel}</span>` : ''}
          <span class="court-badge" style="background:${courtColor}; color:white;">${m.court || ''}</span>
        </div>
      </div>
      <div style="margin: 6px 0;">
        <div style="font-size:1.05em; font-weight:bold;">
          ${teamCrestImg(t1, 22)}${t1.name} <small style="opacity:0.8;">(${t1.p1}${solo ? '' : ` & ${t1.p2}`})</small>
        </div>
        <div style="font-size:0.8em; opacity:0.6; margin:2px 0;">vs</div>
        <div style="font-size:1.05em; font-weight:bold;">
          ${teamCrestImg(t2, 22)}${t2.name} <small style="opacity:0.8;">(${t2.p1}${solo ? '' : ` & ${t2.p2}`})</small>
        </div>
      </div>
      <div style="display:flex; flex-direction:column; gap:8px;">
        ${solo ? `
        <div style="padding:8px; border-radius:5px; ${hinLegColor}; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:6px;">
          <span style="font-size:0.85em;"><strong>Ergebnis:</strong> ${t1.p1} vs. ${t2.p1}</span>
          <div style="display:flex; gap:5px; align-items:center;">
            <input type="number" id="${prefix}h1" min="0" max="20" style="width:40px; text-align:center;" ${(!canEdit || locked) ? 'disabled' : ''} value="${m.score1_h !== null && m.score1_h !== undefined ? m.score1_h : ''}">
            :
            <input type="number" id="${prefix}h2" min="0" max="20" style="width:40px; text-align:center;" ${(!canEdit || locked) ? 'disabled' : ''} value="${m.score2_h !== null && m.score2_h !== undefined ? m.score2_h : ''}">
          </div>
        </div>
        ` : `
        <div style="padding:8px; border-radius:5px; ${hinLegColor}; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:6px;">
          <span style="font-size:0.85em;">🟡 <strong>Hinspiel:</strong> ${t1.p1} vs. ${hinP2}</span>
          <div style="display:flex; gap:5px; align-items:center;">
            <input type="number" id="${prefix}h1" min="0" max="20" style="width:40px; text-align:center;" ${(!canEdit || locked) ? 'disabled' : ''} value="${m.score1_h !== null && m.score1_h !== undefined ? m.score1_h : ''}">
            :
            <input type="number" id="${prefix}h2" min="0" max="20" style="width:40px; text-align:center;" ${(!canEdit || locked) ? 'disabled' : ''} value="${m.score2_h !== null && m.score2_h !== undefined ? m.score2_h : ''}">
          </div>
        </div>
        <div style="padding:8px; border-radius:5px; ${rueckLegColor}; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:6px;">
          <span style="font-size:0.85em;">🔵 <strong>Rückspiel:</strong> ${t1.p2} vs. ${rueckP2}</span>
          <div style="display:flex; gap:5px; align-items:center;">
            <input type="number" id="${prefix}r1" min="0" max="20" style="width:40px; text-align:center;" ${(!canEdit || locked) ? 'disabled' : ''} value="${m.score1_r !== null && m.score1_r !== undefined ? m.score1_r : ''}">
            :
            <input type="number" id="${prefix}r2" min="0" max="20" style="width:40px; text-align:center;" ${(!canEdit || locked) ? 'disabled' : ''} value="${m.score2_r !== null && m.score2_r !== undefined ? m.score2_r : ''}">
          </div>
        </div>
        `}
      </div>
      ${(m.played && !solo) ? `<div style="text-align:center; font-size:0.85em; color:var(--fal-yellow);">Gesamt: <strong>${m.score1} : ${m.score2}</strong></div>` : ''}
      <div style="display:flex; gap:8px; flex-wrap:wrap;">
        ${(canEdit && !locked) ? `<button class="btn-primary btn-sm" style="flex:1;" onclick="submitMatchResult(${m.id}, ${isKO})">💾 ${m.played ? 'Aktualisieren' : 'Ergebnis eintragen'}</button>` : ''}
        ${(hasElevated() && m.played && !m.confirmed) ? `<button class="btn-primary btn-sm" style="flex:1; background:#2ecc71; color:#fff;" onclick="confirmMatchResult(${m.id}, ${isKO})">✅ Bestätigen</button>` : ''}
        ${(hasElevated() && !m.started && !m.played) ? `<button class="btn-secondary btn-sm" style="flex:1; border-color:var(--fal-red); color:var(--fal-red);" onclick="markMatchStarted(${m.id}, ${isKO})">🚦 Spiel gestartet (Wetten schließen)</button>` : ''}
      </div>
    </div>
  `;
}
// Zeigt Gruppenspiele und KO-Spiele im Tab "Spiele"
function renderMatches() {
  const groupContainer = document.getElementById('matches-list');
  const koContainer = document.getElementById('ko-matches-list');
  if (groupContainer) {
    if (!groupMatches || groupMatches.length === 0) {
      groupContainer.innerHTML = '<p class="empty-state">Noch keine Spiele generiert. Bitte zuerst Gruppen auslosen.</p>';
    } else {
      groupContainer.innerHTML = groupMatches.map(m => renderMatchBlock(m, false)).join('');
    }
  }
  if (koContainer) {
    if (!koMatches || koMatches.length === 0) {
      koContainer.innerHTML = '<p class="empty-state">KO-Phase noch nicht ausgelost.</p>';
    } else {
      // Runden nach roundNumber sortieren (0=Runde 1, 1=Runde 2, ...) statt fixer Namensliste,
      // damit das auch für beliebig viele KO-Runden funktioniert (siehe advanceKORound).
      // Innerhalb der letzten Runde steht "Spiel um Platz 3" vor "FINALE".
      const roundNumbers = [...new Set(koMatches.map(m => m.roundNumber || 0))].sort((a, b) => a - b);
      const roundNames = [];
      roundNumbers.forEach(rn => {
        const namesInRound = [...new Set(koMatches.filter(m => (m.roundNumber || 0) === rn).map(m => m.round))];
        namesInRound.sort((a, b) => (a === '🏆 FINALE' ? 1 : 0) - (b === '🏆 FINALE' ? 1 : 0));
        roundNames.push(...namesInRound);
      });
      koContainer.innerHTML = roundNames.map(r => `
        <h4 style="color:var(--fal-yellow); margin-top:15px;">${escapeHtml(r)}</h4>
        ${koMatches.filter(m => m.round === r).map(m => renderMatchBlock(m, true)).join('')}
      `).join('');
    }
  }
}
// Zeigt den ⚽/🎯-Umschalter für die Sportart (nur solange noch keine Teams existieren)
function renderSportToggle() {
  const el = document.getElementById('sport-toggle-container');
  if (!el) return;
  if (teams.length > 0) { el.innerHTML = ''; return; }
  el.innerHTML = `
    <div style="display:flex; align-items:center; justify-content:space-between; background:rgba(0,0,0,0.2); padding:8px 12px; border-radius:8px; flex-wrap:wrap; gap:8px;">
      <span style="font-size:0.9em;">${tournamentSport === 'darts' ? '🎯 Darts-Turnier (kein Verein, jeder Spieler ist sein eigenes Team)' : '⚽ FIFA-Turnier (mit Vereinen)'}</span>
      <button class="btn-secondary btn-sm" onclick="toggleTournamentSport()">Umschalten</button>
    </div>
  `;
}
// Baut den Team-Erstellungs-Schritt im Admin-Panel auf - bei FIFA das gewohnte Team-
// Glücksrad (mit Vereinen), bei Darts einen einzigen "Teilnehmer übernehmen"-Button ohne
// jegliches Vereins-/Auslosungs-Konzept (siehe createDartsTeamsFromPlayers).
function renderTeamStepPanel() {
  const el = document.getElementById('team-step-container');
  if (!el) return;
  el.innerHTML = tournamentSport === 'darts'
    ? `<button class="btn-primary" style="background-color:#ffc800; color:#000;" onclick="createDartsTeamsFromPlayers()">🎯 1. Teilnehmer übernehmen (kein Verein nötig)</button>`
    : `
      <button class="btn-primary" style="background-color:#ffc800; color:#000;" onclick="startInteractiveDraft()">🎰 1. Teams & Clubs per Glücksrad auslosen</button>
      <button class="btn-secondary" onclick="quickDrawTeams()">⚡ 1b. Sofort auslosen (ohne Show/Animation)</button>
    `;
}
// Baut den kompletten Admin-Bereich auf: Spielerverwaltung, Test-Spieler-Button, Club-Liste, Registrierungssperre
// Zeigt im Admin-Panel EINEN dynamischen Button für die KO-Phase, statt fixer
// Viertel-/Halbfinale/Finale-Schritte - der Text passt sich dem aktuellen Fortschritt an
// (siehe advanceKORound für die eigentliche Logik).
function renderKOControlPanel() {
  const el = document.getElementById('ko-control-container');
  if (!el) return;
  if (!groups || groups.length === 0) {
    el.innerHTML = `<p style="opacity:0.7; font-size:0.9em;">Zuerst die Gruppenphase auslosen.</p>`;
    return;
  }
  if (koMatches.length === 0) {
    el.innerHTML = `<button class="btn-primary" onclick="advanceKORound()">⚔️ 3. KO-Runde auslosen (Teilnehmerzahl wählbar)</button>`;
    return;
  }
  if (koMatches.some(m => m.round === '🏆 FINALE')) {
    el.innerHTML = `<p style="opacity:0.8; font-size:0.9em;">🏆 Finale wurde bereits ausgelost - das Turnier ist komplett.</p>`;
    return;
  }
  const currentRoundNumber = Math.max(...koMatches.map(m => m.roundNumber || 0));
  const currentRoundMatches = koMatches.filter(m => (m.roundNumber || 0) === currentRoundNumber);
  const allPlayed = currentRoundMatches.every(m => m.played);
  el.innerHTML = allPlayed
    ? `<button class="btn-primary" onclick="advanceKORound()">⚔️ Nächste KO-Runde auslosen</button>`
    : `<p style="opacity:0.8; font-size:0.9em;">⏳ Erst alle Spiele der aktuellen Runde (${escapeHtml(currentRoundMatches[0].round)}) eintragen, dann kann die nächste Runde ausgelost werden.</p>`;
}
function renderAdminPanel() {
  const playerListEl = document.getElementById('admin-player-list');
  const clubListEl = document.getElementById('admin-club-list');
  const lockContainer = document.getElementById('registration-lock-container');
  const testPlayerContainer = document.getElementById('test-player-container');
  // Test-Spieler-Button nur für den echten Admin sichtbar (nicht für Refs)
  if (testPlayerContainer) {
    testPlayerContainer.innerHTML = isAdmin()
      ? `<button class="btn-secondary btn-sm" onclick="addTestPlayers()">🧪 Test-Spieler automatisch hinzufügen</button>`
      : '';
  }
  renderInvitePanel();
  renderSportToggle();
  renderTeamStepPanel();
  renderDraftCheatPanel();
  renderKOControlPanel();
  // Zeitabstand-Eingabefeld mit dem aktuellen Wert synchron halten - aber nicht, während
  // der Admin gerade selbst darin tippt (sonst würde ein Live-Update seine Eingabe überschreiben)
  const intervalInput = document.getElementById('match-interval-input');
  if (intervalInput && document.activeElement !== intervalInput) {
    intervalInput.value = matchIntervalMinutes;
  }
  const coinAnimSelect = document.getElementById('coin-animation-select');
  if (coinAnimSelect) coinAnimSelect.value = coinAnimation;
  const coinAnimPreview = document.getElementById('coin-animation-preview');
  if (coinAnimPreview) coinAnimPreview.innerHTML = coinIcon(18);
  if (lockContainer) {
    lockContainer.innerHTML = `
      ${teams.length === 0 ? `
      <div style="display:flex; align-items:center; justify-content:space-between; background:rgba(0,0,0,0.2); padding:8px 12px; border-radius:8px; margin-bottom:8px; flex-wrap:wrap; gap:8px;">
        <span style="font-size:0.9em;">${tournamentMode === 'solo' ? '👤 Einzel-Modus (jeder Spieler bekommt seinen eigenen Verein)' : '👬 Duo-Modus (2er-Teams teilen sich einen Verein)'}</span>
        <button class="btn-secondary btn-sm" onclick="toggleTournamentMode()">Umschalten</button>
      </div>` : ''}
      ${plannedPlayerCount ? `<p style="font-size:0.85em; opacity:0.75; margin:0 0 8px 0;">🎯 Geplant: ${plannedPlayerCount} Spieler (aktuell ${players.length})</p>` : ''}
      <div style="display:flex; align-items:center; justify-content:space-between; background:rgba(0,0,0,0.2); padding:8px 12px; border-radius:8px; margin-bottom:8px; flex-wrap:wrap; gap:8px;">
        <span style="font-size:0.9em;">${registrationLocked ? '🔒 Registrierung gesperrt' : '🔓 Registrierung offen'}</span>
        <button class="btn-secondary btn-sm" onclick="toggleRegistrationLock()">${registrationLocked ? 'Entsperren' : 'Sperren'}</button>
      </div>
      <div style="display:flex; align-items:center; justify-content:space-between; background:rgba(0,0,0,0.2); padding:8px 12px; border-radius:8px; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
        <span style="font-size:0.9em;">
          ${joinPassword ? '🔑 Beitritts-Passwort aktiv' : '🔓 Kein Beitritts-Passwort'}<br>
          <span style="font-size:0.85em; opacity:0.7;">(nur neue Spieler brauchen es)</span>
        </span>
        <div style="display:flex; gap:6px;">
          <button class="btn-secondary btn-sm" onclick="setTournamentJoinPassword()">${joinPassword ? 'Ändern' : 'Festlegen'}</button>
          ${joinPassword ? '<button class="btn-danger btn-sm" onclick="clearTournamentJoinPassword()">Entfernen</button>' : ''}
        </div>
      </div>
    `;
  }
  if (playerListEl) {
    // Das Passwort ist jetzt identitätsweit (siehe globalPlayers) statt pro Turnier - hier
    // wird es deshalb nur noch angezeigt, verwaltet wird es zentral im God-Panel ("Alle Spieler").
    playerListEl.innerHTML = players.map((p, index) => {
      const gp = getGlobalPlayer(p.name);
      const hasPW = !!(gp && gp.password);
      const isRefBtnClass = p.isRef ? 'btn-primary' : 'btn-secondary';
      return `
        <div style="display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; background: var(--fal-blue-primary); padding: 10px 12px; border-radius: 8px; margin-bottom: 8px; gap: 8px;">
          <div>
            <strong>${index + 1}. ${p.name}</strong>
            ${p.isTournamentOwner ? '<span style="color:var(--fal-yellow); font-size:0.85em;">[⭐ Ersteller]</span>' : ''}
            ${p.isRef ? '<span style="color:var(--fal-yellow); font-size:0.85em;">[🟨 Ref]</span>' : ''}
            ${hasPW ? '<span style="font-size:0.85em; opacity:0.8;">[🔒 PW]</span>' : ''}
          </div>

          <div style="display:flex; gap: 5px; flex-wrap:wrap;">
            ${isAdmin() ? `<button class="${isRefBtnClass} btn-sm" onclick="toggleRef(${index})">${p.isRef ? '🟨 Ref (Aktiv)' : 'Ref vergeben'}</button>` : ''}
            ${isAdmin() ? `<button class="btn-danger btn-sm" onclick="removePlayer(${index})">🗑️</button>` : ''}
          </div>
        </div>
      `;
    }).join('');
  }
  if (clubListEl) {
    clubListEl.innerHTML = availableClubs.map((club, index) => `
      <span class="club-badge">
        ${clubLogoImg(club, 16)}${club}
        <span style="cursor:pointer;" title="Wappen-URL eingeben" onclick="setClubLogo('${club.replace(/'/g, "\\'")}')">🖼️</span>
        <span style="cursor:pointer;" title="Foto hochladen (Kamera/Galerie)" onclick="triggerClubLogoUpload('${club.replace(/'/g, "\\'")}')">📷</span>
        <span style="cursor:pointer; color:#ff4d4d; font-weight:bold; margin-left:4px;" onclick="removeClub(${index})">×</span>
      </span>
    `).join('');
  }
}
// ============================================================================
// 11. WETT-SYSTEM — FAL-Coins, Wetten auf Spielausgänge platzieren & auszahlen.
//     Wetten sind nur möglich, solange ein Spiel weder gestartet (m.started)
//     noch beendet (m.played) ist — siehe placeBet() und markMatchStarted().
// ============================================================================
// Ändert, wie sich das FAL-Coin-Symbol website-weit für dieses Turnier bewegt
// (still/spin/bounce/pulse) - admin-einstellbar im Admin-Panel unter Turnier-Steuerung.
function setCoinAnimation(mode) {
  if (!hasElevated()) return;
  coinAnimation = mode;
  saveData();
  renderAll();
}
// Liest den Coin-Kontostand eines Spielers aus (Startguthaben: 100 Coins)
function getUserBalance(playerName) {
  if (!playerName) return 0;
  if (userBalances[playerName] === undefined) {
    userBalances[playerName] = 100;
  }
  return userBalances[playerName];
}
// Zeigt Kontostand, offene Wett-Möglichkeiten (ohne gestartete Spiele) und die Highroller-Bestenliste
function renderBettingSystem() {
  const balanceEl = document.getElementById('user-coin-balance');
  const matchesListEl = document.getElementById('betting-matches-list');
  const leaderboardEl = document.getElementById('betting-leaderboard');
  if (!balanceEl || !matchesListEl || !leaderboardEl) return;
  const coinIconEl = document.getElementById('home-coin-icon');
  if (coinIconEl) coinIconEl.innerHTML = coinIcon(20);

  const currentBalance = myPlayerName ? getUserBalance(myPlayerName) : 0;
  balanceEl.innerText = currentBalance;

  const upcoming = [
    ...groupMatches.map(m => ({ ...m, isKO: false })),
    ...koMatches.map(m => ({ ...m, isKO: true }))
  ].filter(m => !m.played && !m.started && m.t1Id && m.t2Id).slice(0, 3);

  if (upcoming.length === 0) {
    matchesListEl.innerHTML = '<p style="opacity:0.7;">Aktuell keine anstehenden Spiele zum Wetten verfügbar.</p>';
  } else {
    matchesListEl.innerHTML = upcoming.map(m => {
      const t1 = teams.find(t => t.id === m.t1Id);
      const t2 = teams.find(t => t.id === m.t2Id);
      if (!t1 || !t2) return '';
      const myExistingBet = bets.find(b => b.matchId === m.id && b.isKO === m.isKO && b.playerName === myPlayerName);
      const uid = `${m.isKO ? 'ko' : 'gr'}-${m.id}`;

      return `
        <div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 8px; margin-bottom: 10px; border: 1px solid rgba(255,255,255,0.1);">
          <div style="font-size: 0.85em; opacity: 0.8; margin-bottom: 5px;">${m.isKO ? m.round : m.group}</div>
          <div style="display: flex; justify-content: space-between; align-items: center; font-weight: bold; margin-bottom: 10px; flex-wrap:wrap; gap:6px;">
            <span>${teamCrestImg(t1, 20)}${t1.name}</span>
            <span style="color: var(--fal-yellow);">VS</span>
            <span>${teamCrestImg(t2, 20)}${t2.name}</span>
          </div>
          ${myExistingBet ? `
            <div style="text-align:center; font-size: 0.9em; color: var(--fal-yellow); background: rgba(0,0,0,0.2); padding: 5px; border-radius: 5px;">
              ✅ Gewettet: <strong>${myExistingBet.amount} Coins</strong> auf <strong>${myExistingBet.chosenTeamId === t1.id ? t1.name : t2.name}</strong>
            </div>
          ` : `
            <div class="bet-input-row">
              <select id="bet-team-${uid}">
                <option value="${t1.id}">${t1.name}</option>
                <option value="${t2.id}">${t2.name}</option>
              </select>
              <input type="number" id="bet-amount-${uid}" placeholder="Coins" min="1" max="${currentBalance}">
              <button class="btn-primary" style="padding: 6px 12px; font-size: 0.9em;" onclick="placeBet(${m.id}, ${m.isKO})">Wetten</button>
            </div>
          `}
        </div>
      `;
    }).join('');
  }

  const sortedUsers = Object.keys(userBalances)
    .map(name => ({ name, balance: userBalances[name] }))
    .sort((a, b) => b.balance - a.balance)
    .slice(0, 5);

  if (sortedUsers.length === 0) {
    leaderboardEl.innerHTML = '<p style="font-size:0.85em; opacity:0.7;">Noch keine Konten aktiv.</p>';
  } else {
    leaderboardEl.innerHTML = sortedUsers.map((u, i) => `
      <div class="leaderboard-item">
        <span>${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`} ${u.name}</span>
        <span style="font-weight: bold; color: var(--fal-yellow); display:inline-flex; align-items:center; gap:4px;">${u.balance} ${coinIcon(15)}</span>
      </div>
    `).join('');
  }
}
// Spieler setzt Coins auf den Sieger eines Spiels (nur solange es nicht gestartet/beendet ist)
function placeBet(matchId, isKO) {
  if (!myPlayerName) return alert('Bitte melde dich erst an, um zu wetten!');
  const match = getMatchArray(isKO).find(m => m.id === matchId);
  if (!match) return;
  if (match.started || match.played) return alert('Wetten für dieses Spiel sind bereits geschlossen (Spiel wurde gestartet oder ist bereits beendet)!');
  const uid = `${isKO ? 'ko' : 'gr'}-${matchId}`;
  const teamSelect = document.getElementById(`bet-team-${uid}`);
  const amountInput = document.getElementById(`bet-amount-${uid}`);
  if (!teamSelect || !amountInput) return;
  const chosenTeamId = parseInt(teamSelect.value);
  const amount = parseInt(amountInput.value);
  const currentBalance = getUserBalance(myPlayerName);
  if (isNaN(amount) || amount <= 0) return alert('Bitte einen gültigen Wettbetrag eingeben!');
  if (amount > currentBalance) return alert('Du hast nicht genügend FAL-Coins!');
  userBalances[myPlayerName] -= amount;
  bets.push({ matchId, isKO, playerName: myPlayerName, chosenTeamId, amount });
  saveData();
}
// Zahlt nach Bestätigung eines Ergebnisses alle Wetten auf dieses Spiel aus (Quote 2:1)
function evaluateBetsForMatch(matchId, isKO, winningTeamId) {
  const relatedBets = bets.filter(b => b.matchId === matchId && b.isKO === isKO);
  relatedBets.forEach(b => {
    if (b.chosenTeamId === winningTeamId) {
      const winAmount = b.amount * 2;
      userBalances[b.playerName] = (userBalances[b.playerName] || 0) + winAmount;
    }
  });
  bets = bets.filter(b => !(b.matchId === matchId && b.isKO === isKO));
  const matchArray = getMatchArray(isKO);
  const match = matchArray.find(m => m.id === matchId);
  if (match) match.betsEvaluated = true;
  saveData();
}
// ============================================================================
// 12. TURNIER-WRAPPED — eine persönliche Rückblick-Karte pro Spieler nach dem
//     Finale, im Stil von "Spotify Wrapped": eigene Tore, bestes Ergebnis,
//     Coin-Bilanz und ein launiger Titel, der aus den Stats abgeleitet wird.
//     Rein zum Spaß, nutzt aber ausschließlich Daten, die eh schon erfasst sind.
// ============================================================================
// Baut die "Spiel-Historie" eines einzelnen Spielers: jedes Hin-/Rückspiel-Bein,
// bei dem er selbst gespielt hat, mit Gegner und Ergebnis aus SEINER Sicht.
function calculatePlayerMatchLog(playerName) {
  const log = [];
  function processLeg(m, isHin, roundLabel) {
    const s1 = isHin ? m.score1_h : m.score1_r;
    const s2 = isHin ? m.score2_h : m.score2_r;
    if (s1 === null || s1 === undefined || s2 === null || s2 === undefined) return;
    const t1 = teams.find(t => t.id === m.t1Id);
    const t2 = teams.find(t => t.id === m.t2Id);
    if (!t1 || !t2) return;
    const playerA = isHin ? t1.p1 : t1.p2;
    const playerB = isHin ? (m.crossed ? t2.p2 : t2.p1) : (m.crossed ? t2.p1 : t2.p2);
    if (playerA === playerName) {
      log.push({ opponent: playerB, goalsFor: s1, goalsAgainst: s2, round: roundLabel });
    } else if (playerB === playerName) {
      log.push({ opponent: playerA, goalsFor: s2, goalsAgainst: s1, round: roundLabel });
    }
  }
  const solo = tournamentMode === 'solo';
  groupMatches.forEach(m => {
    processLeg(m, true, solo ? m.group : `${m.group} (Hinspiel)`);
    processLeg(m, false, `${m.group} (Rückspiel)`);
  });
  koMatches.forEach(m => {
    processLeg(m, true, solo ? m.round : `${m.round} (Hinspiel)`);
    processLeg(m, false, `${m.round} (Rückspiel)`);
  });
  return log;
}
// Liefert das (nach Tordifferenz) beste und schlechteste Einzelergebnis eines Spielers
function getBestAndWorstResult(playerName) {
  const log = calculatePlayerMatchLog(playerName);
  if (log.length === 0) return { best: null, worst: null };
  const sorted = [...log].sort((a, b) => (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst));
  return { best: sorted[0], worst: sorted[sorted.length - 1] };
}
// Vergibt einen launigen "Wrapped"-Titel, indem die Stats mit allen anderen
// Spielern verglichen werden (nach dem Vorbild von Spotify Wrapped)
function getWrappedTitle(playerName) {
  const allStats = calculatePlayerStats().filter(s => s.played > 0);
  const me = allStats.find(s => s.name === playerName);
  if (!me) return { emoji: '🎮', title: 'Turnier-Teilnehmer', text: 'Noch keine Spiele erfasst.' };
  const topScorer = [...allStats].sort((a, b) => b.goals - a.goals)[0];
  const bestWinrate = allStats.filter(s => s.played >= 2).sort((a, b) => (b.wins / b.played) - (a.wins / a.played))[0];
  const bestDefense = allStats.filter(s => s.played >= 2).sort((a, b) => (a.conceded / a.played) - (b.conceded / b.played))[0];
  const balanceEntries = Object.entries(userBalances);
  const richest = balanceEntries.length ? [...balanceEntries].sort((a, b) => b[1] - a[1])[0][0] : null;
  const poorest = balanceEntries.length ? [...balanceEntries].sort((a, b) => a[1] - b[1])[0][0] : null;

  if (topScorer && topScorer.name === playerName && topScorer.goals > 0) {
    return { emoji: '⚽', title: 'Tormaschine des Turniers', text: `${me.goals} Tore erzielt – niemand hat öfter getroffen!` };
  }
  if (bestWinrate && bestWinrate.name === playerName && bestWinrate.wins > 0) {
    return { emoji: '👑', title: 'Seriensieger', text: `${me.wins} von ${me.played} Spielen gewonnen – beste Siegquote im ganzen Turnier!` };
  }
  if (bestDefense && bestDefense.name === playerName) {
    return { emoji: '🛡️', title: 'Die Mauer', text: `Nur Ø ${(me.conceded / me.played).toFixed(1)} Gegentore pro Spiel – die beste Abwehr im Turnier!` };
  }
  if (richest === playerName && userBalances[playerName] > 100) {
    return { emoji: '💰', title: 'Zocker-König', text: `${userBalances[playerName]} FAL-Coins auf dem Konto – am cleversten gewettet!` };
  }
  if (poorest === playerName && userBalances[playerName] < 100) {
    return { emoji: '🎲', title: 'Va-Banque-Spieler', text: 'Nicht jede Wette ging auf – aber Mut zum Risiko zählt auch etwas!' };
  }
  if (me.goals === 0) {
    return { emoji: '🐢', title: 'Spätzünder', text: 'Noch kein Tor erzielt – beim nächsten Turnier klappt’s bestimmt!' };
  }
  return { emoji: '🎮', title: 'Turnier-Teilnehmer', text: 'Mit vollem Einsatz von Anfang bis Ende dabei gewesen!' };
}
// Baut den Inhalt der Wrapped-Karte für den aktuell angemeldeten Spieler auf
function renderWrappedCard() {
  const container = document.getElementById('wrapped-content');
  if (!container || !myPlayerName) return;
  const stats = calculatePlayerStats().find(s => s.name === myPlayerName) || { goals: 0, conceded: 0, wins: 0, played: 0 };
  const { best, worst } = getBestAndWorstResult(myPlayerName);
  const wrapped = getWrappedTitle(myPlayerName);
  const balance = getUserBalance(myPlayerName);
  const myTip = tips[myPlayerName];
  const tipTeam = myTip ? teams.find(t => t.id === myTip.teamId) : null;
  const finale = koMatches.find(m => m.round === '🏆 FINALE' && m.confirmed);
  const winningTeam = finale ? teams.find(t => t.id === (finale.score1 > finale.score2 ? finale.t1Id : finale.t2Id)) : null;
  const tipHit = !!(myTip && winningTeam && myTip.teamId === winningTeam.id);
  const worstIsLoss = worst && (worst.goalsFor - worst.goalsAgainst) < 0;

  container.innerHTML = `
    <div class="wrapped-title-block">
      <div style="font-size:3em;">${wrapped.emoji}</div>
      <h2 style="margin:6px 0 2px 0;">${wrapped.title}</h2>
      <p style="opacity:0.9; font-size:0.9em;">${wrapped.text}</p>
    </div>
    <div class="wrapped-stats-grid">
      <div class="wrapped-stat"><div class="wrapped-stat-value">${stats.goals}</div><div class="wrapped-stat-label">⚽ Tore</div></div>
      <div class="wrapped-stat"><div class="wrapped-stat-value">${stats.conceded}</div><div class="wrapped-stat-label">🥅 Gegentore</div></div>
      <div class="wrapped-stat"><div class="wrapped-stat-value">${stats.wins}/${stats.played}</div><div class="wrapped-stat-label">🏅 Siege</div></div>
      <div class="wrapped-stat"><div class="wrapped-stat-value" style="display:flex; align-items:center; justify-content:center; gap:5px;">${balance} ${coinIcon(18)}</div><div class="wrapped-stat-label">Kontostand</div></div>
    </div>
    ${best ? `<div class="wrapped-highlight">🔥 Bestes Ergebnis: <strong>${best.goalsFor}:${best.goalsAgainst}</strong> gegen ${escapeHtml(best.opponent)}</div>` : ''}
    ${worstIsLoss ? `<div class="wrapped-highlight">😅 Bitterste Niederlage: <strong>${worst.goalsFor}:${worst.goalsAgainst}</strong> gegen ${escapeHtml(worst.opponent)}</div>` : ''}
    ${myTip ? `<div class="wrapped-highlight">🎯 Dein Tipp: <strong>${tipTeam ? escapeHtml(tipTeam.name) : '?'}</strong> ${winningTeam ? (tipHit ? '– ✅ Richtig getippt!' : '– ❌ Leider daneben') : '(Turnier läuft noch)'}</div>` : ''}
  `;
}
// Öffnet/schließt die Wrapped-Karte
function openWrapped() {
  if (!myPlayerName) return;
  renderWrappedCard();
  const modal = document.getElementById('wrapped-modal');
  if (modal) modal.style.display = 'flex';
}
function closeWrapped() {
  const modal = document.getElementById('wrapped-modal');
  if (modal) modal.style.display = 'none';
}
// Hilfsfunktion: Gibt Wappen-HTML + Vereinsnamen aus
function renderClubNameWithBadge(clubName) {
  if (!clubName) return '';
  const logoUrl = getClubLogoUrl(clubName); // Deine Funktion/Map für Logos
  const badgeHtml = logoUrl 
    ? `<img src="${escapeHtml(logoUrl)}" alt="${escapeHtml(clubName)}" class="club-logo-icon" style="width:18px; height:18px; vertical-align:middle; margin-right:4px;">`
    : '';
  return `<span class="club-badge-inline">${badgeHtml}${escapeHtml(clubName)}</span>`;
}

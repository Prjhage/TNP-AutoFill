'use strict';

// ═══════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════
let skills = [];
let customFields = [];
let certHasDone = 'No';
let selectedRatings = { codechef: null, hackerrank: null };
let selectedToggles = {
  gender: null, degree: null, specialization: null,
  college: null, skillset: [], prevDegree: null, backlogs: null
};
let gfType = 'short';
let gfOptions = [];

const TYPE_LABELS = {
  short: 'Short answer', paragraph: 'Paragraph',
  radio: 'Multiple choice', checkbox: 'Checkboxes',
  dropdown: 'Dropdown', date: 'Date', time: 'Time',
  number: 'Number', url: 'Link / URL'
};

const TYPE_ICONS_SVG = {
  short:     `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="12" y2="6"/></svg>`,
  paragraph: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,
  radio:     `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>`,
  checkbox:  `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><polyline points="9 12 11 14 15 10"/></svg>`,
  dropdown:  `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="6" width="18" height="12" rx="2"/><polyline points="9 12 12 15 15 12"/></svg>`,
  date:      `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  time:      `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  number:    `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>`,
  url:       `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
};

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════
function $(id) { return document.getElementById(id); }

function toast(msg, type = 'ok') {
  const el = $('toast');
  el.textContent = msg;
  el.className = 'toast ' + type;
  void el.offsetWidth;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2600);
}

function gval(id) { const el = $(id); return el ? el.value.trim() : ''; }

// ═══════════════════════════════════════════════════════════
// TABS
// ═══════════════════════════════════════════════════════════
function initTabs() {
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('on'));
      document.querySelectorAll('.panel').forEach(p => p.classList.remove('on'));
      tab.classList.add('on');
      $('panel-' + tab.dataset.tab).classList.add('on');
    });
  });
}

// ═══════════════════════════════════════════════════════════
// MAHARASHTRA COLLEGES LIST
// ═══════════════════════════════════════════════════════════
const ALL_COLLEGES = [
  "Indian Institute of Technology Bombay (IIT Bombay), Mumbai, Maharashtra",
  "Visvesvaraya National Institute of Technology (VNIT), Nagpur, Maharashtra",
  "Institute of Chemical Technology (ICT), Mumbai, Maharashtra",
  "College of Engineering Pune (COEP), Pune, Maharashtra",
  "Pune Institute of Computer Technology (PICT), Pune, Maharashtra",
  "Vishwakarma Institute of Technology (VIT), Pune, Maharashtra",
  "Symbiosis Institute of Technology (SIT), Pune, Maharashtra",
  "MIT College of Engineering (MITCOE), Pune, Maharashtra",
  "Army Institute of Technology (AIT), Pune, Maharashtra",
  "Cummins College of Engineering for Women, Pune, Maharashtra",
  "Marathwada Mitra Mandal's College of Engineering (MMCOE), Pune, Maharashtra",
  "PES Modern College of Engineering, Pune, Maharashtra",
  "Jayawantrao Sawant College of Engineering (JSCOE), Pune, Maharashtra",
  "Genba Sopanrao Moze College of Engineering, Pune, Maharashtra",
  "Jaihind College of Engineering, Pune, Maharashtra",
  "Dhole Patil College of Engineering, Pune, Maharashtra",
  "Alard College of Engineering and Management, Pune, Maharashtra",
  "Zeal College of Engineering and Research, Pune, Maharashtra",
  "NBN Sinhgad School of Engineering, Pune, Maharashtra",
  "Dr. D.Y. Patil Institute of Engineering Management and Research, Pune, Maharashtra",
  "Savitribai Phule Pune University (SPPU), Pune, Maharashtra",
  "Padmabhushan Vasantdada Patil Institute of Technology (PVPIT), Pune, Maharashtra",
  "Trinity College of Engineering and Research, Pune, Maharashtra",
  "International Institute of Information Technology (IIITP), Pune, Maharashtra",
  "Symbiosis Skills and Professional University, Pune, Maharashtra",
  "Indira College of Engineering and Management (ICEM), Pune, Maharashtra",
  "Dr. Vishwanath Karad MIT World Peace University, Pune, Maharashtra",
  "G.H. Raisoni College of Engineering and Management, Pune, Maharashtra",
  "Smt. Kashibai Navale College of Engineering, Pune, Maharashtra",
  "Bharati Vidyapeeth College of Engineering, Pune, Maharashtra",
  "Konkan Gyanpeeth Rahul Dharkar College of Engineering, Pune, Maharashtra",
  "Progressive Education Society's Modern College of Engineering, Pune, Maharashtra",
  "Sinhgad College of Engineering (SCOE), Pune, Maharashtra",
  "Sinhgad Institute of Technology (SIT), Lonavala, Maharashtra",
  "Sinhgad Academy of Engineering (SAE), Kondhwa, Pune, Maharashtra",
  "Sinhgad Institute of Technology and Science (SITS), Narhe, Pune, Maharashtra",
  "Sinhgad College of Engineering (SCOE), Vadgaon, Pune, Maharashtra",
  "Pimpri Chinchwad College of Engineering (PCCOE), Pune, Maharashtra",
  "Pimpri Chinchwad College of Engineering and Research (PCCOE&R), Pune, Maharashtra",
  "New Horizon Institute of Technology and Management (NMIET), Pune, Maharashtra",
  "NCER Pimpri Chinchwad, Pune, Maharashtra",
  "PCU Pimpri Chinchwad University, Pune, Maharashtra",
  "D.Y. Patil College of Engineering, Akurdi, Pune, Maharashtra",
  "Bhivarabai Sawant College of Engineering and Research, Pune, Maharashtra",
  "Veermata Jijabai Technological Institute (VJTI), Mumbai, Maharashtra",
  "Sardar Patel College of Engineering (SPCE), Mumbai, Maharashtra",
  "K.J. Somaiya College of Engineering, Mumbai, Maharashtra",
  "Thadomal Shahani Engineering College (TSEC), Mumbai, Maharashtra",
  "Fr. Conceicao Rodrigues College of Engineering (CRCE), Mumbai, Maharashtra",
  "Dwarkadas J. Sanghvi College of Engineering (DJSCE), Mumbai, Maharashtra",
  "Vivekanand Education Society's Institute of Technology (VESIT), Mumbai, Maharashtra",
  "Shah and Anchor Kutchhi Engineering College (SAKEC), Mumbai, Maharashtra",
  "St. Francis Institute of Technology (SFIT), Mumbai, Maharashtra",
  "MGM College of Engineering, Mumbai, Maharashtra",
  "Rajiv Gandhi Institute of Technology (RGIT), Mumbai, Maharashtra",
  "Xavier Institute of Engineering, Mumbai, Maharashtra",
  "Rizvi College of Engineering, Mumbai, Maharashtra",
  "Vidyalankar Institute of Technology (VIT), Mumbai, Maharashtra",
  "Atharva College of Engineering, Mumbai, Maharashtra",
  "Don Bosco Institute of Technology (DBIT), Mumbai, Maharashtra",
  "Thakur College of Engineering and Technology, Mumbai, Maharashtra",
  "Universal College of Engineering (UCOE), Mumbai, Maharashtra",
  "Agnel Charities' Fr. C. Rodrigues Institute of Technology, Mumbai, Maharashtra",
  "Shree L.R. Tiwari College of Engineering, Mumbai, Maharashtra",
  "Vidyavardhini's College of Engineering and Technology, Mumbai, Maharashtra",
  "Saraswati College of Engineering, Khopoli, Maharashtra",
  "Terna Engineering College, Navi Mumbai, Maharashtra",
  "Pillai College of Engineering, Navi Mumbai, Maharashtra",
  "Dr. D.Y. Patil Institute of Technology, Navi Mumbai, Maharashtra",
  "Bharati Vidyapeeth College of Engineering, Navi Mumbai, Maharashtra",
  "SIES Graduate School of Technology, Navi Mumbai, Maharashtra",
  "Ramrao Adik Institute of Technology (RAIT), Navi Mumbai, Maharashtra",
  "Terna College of Engineering, Nerul, Navi Mumbai, Maharashtra",
  "D.Y. Patil International University, Akurdi, Maharashtra",
  "Kalsekar Technical Campus, Navi Mumbai, Maharashtra",
  "Mumbai University Institute of Chemical Technology, Mumbai, Maharashtra",
  "Lokmanya Tilak College of Engineering, Navi Mumbai, Maharashtra",
  "Mahatma Education Society's Pillai HOC College of Engineering, Navi Mumbai, Maharashtra",
  "Mahatma Gandhi Mission's College of Engineering, Navi Mumbai, Maharashtra",
  "Sandip Institute of Technology and Research Centre, Nashik, Maharashtra",
  "K.K. Wagh Institute of Engineering Education and Research, Nashik, Maharashtra",
  "MVP's KBT College of Engineering, Nashik, Maharashtra",
  "Amrutvahini College of Engineering, Sangamner, Maharashtra",
  "Government College of Engineering, Nashik, Maharashtra",
  "Matoshri College of Engineering and Research Centre, Nashik, Maharashtra",
  "NDMVP's College of Engineering, Nashik, Maharashtra",
  "Pravara Rural Engineering College, Loni, Maharashtra",
  "Gokhale Education Society's R.H. Sapat College of Engineering, Nashik, Maharashtra",
  "Nashik Engineering Cluster's College of Engineering, Nashik, Maharashtra",
  "Government College of Engineering, Aurangabad, Maharashtra",
  "MGM College of Engineering and Technology, Aurangabad, Maharashtra",
  "Deogiri Institute of Engineering and Management Studies, Aurangabad, Maharashtra",
  "MIT College of Engineering, Aurangabad, Maharashtra",
  "Shreeyash College of Engineering and Technology, Aurangabad, Maharashtra",
  "Dr. Babasaheb Ambedkar Marathwada University, Aurangabad, Maharashtra",
  "SRTM University, Nanded, Maharashtra",
  "Yeshwantrao Chavan College of Engineering (YCCE), Nagpur, Maharashtra",
  "Priyadarshini College of Engineering (PCE), Nagpur, Maharashtra",
  "Shri Ramdeobaba College of Engineering and Management (RCOEM), Nagpur, Maharashtra",
  "G.H. Raisoni College of Engineering (GHRCE), Nagpur, Maharashtra",
  "Rajiv Gandhi College of Engineering Research and Technology, Nagpur, Maharashtra",
  "Laxminarayan Institute of Technology (LIT), Nagpur, Maharashtra",
  "KDK College of Engineering, Nagpur, Maharashtra",
  "Priyadarshini Institute of Engineering and Technology (PIET), Nagpur, Maharashtra",
  "Wainganga College of Engineering and Management, Nagpur, Maharashtra",
  "Jhulelal Institute of Technology, Nagpur, Maharashtra",
  "Tulsiramji Gaikwad Patil College of Engineering, Nagpur, Maharashtra",
  "RTMNU - Rashtrasant Tukadoji Maharaj Nagpur University, Nagpur, Maharashtra",
  "Shri Sant Gajanan Maharaj College of Engineering, Shegaon, Maharashtra",
  "Bapurao Deshmukh College of Engineering, Wardha, Maharashtra",
  "Shivaji University, Kolhapur, Maharashtra",
  "DY Patil College of Engineering, Kolhapur, Maharashtra",
  "Rajarambapu Institute of Technology (RIT), Islampur, Maharashtra",
  "Walchand College of Engineering, Sangli, Maharashtra",
  "Sharad Institute of Technology College of Engineering, Ichalkaranji, Maharashtra",
  "D.Y. Patil Technical Campus, Kolhapur, Maharashtra",
  "Textile and Engineering Institute, Ichalkaranji, Maharashtra",
  "KIT's College of Engineering, Kolhapur, Maharashtra",
  "Shivaji University College of Engineering, Kolhapur, Maharashtra",
  "Bharati Vidyapeeth College of Engineering, Kolhapur, Maharashtra",
  "Solapur University, Solapur, Maharashtra",
  "Walchand Institute of Technology, Solapur, Maharashtra",
  "DKTES's Textile and Engineering Institute, Ichalkaranji, Maharashtra",
  "Government College of Engineering, Solapur, Maharashtra",
  "Government College of Engineering, Latur, Maharashtra",
  "Aditya College of Engineering and Technology, Beed, Maharashtra",
  "Shri Guru Gobind Singhji Institute of Engineering and Technology (SGGSIEET), Nanded, Maharashtra",
  "Jawaharlal Darda Institute of Engineering and Technology (JDIET), Yavatmal, Maharashtra",
  "Government College of Engineering, Amravati, Maharashtra",
  "Sipna College of Engineering and Technology, Amravati, Maharashtra",
  "Prof. Ram Meghe Institute of Technology and Research, Amravati, Maharashtra",
  "Shankarlal Khandelwal College of Engineering, Akola, Maharashtra",
  "Finolex Academy of Management and Technology (FAMT), Ratnagiri, Maharashtra",
  "Konkan Gyanpeeth College of Engineering, Karjat, Maharashtra",
  "Agnel Technical Education Complex, Vashi, Navi Mumbai, Maharashtra",
  "D.Y. Patil College of Engineering, Kolhapur, Maharashtra",
  "Amity University Mumbai, Mumbai, Maharashtra",
  "Symbiosis International University, Pune, Maharashtra",
  "Indian Institute of Technology Tirupati (IIT Tirupati), Tirupati, Andhra Pradesh",
  "Indian Institute of Information Technology Sri City, Chittoor, Andhra Pradesh",
  "VIT-AP University, Amaravati, Andhra Pradesh",
  "JNTU Kakinada, Kakinada, Andhra Pradesh",
  "JNTU Anantapur, Anantapur, Andhra Pradesh",
  "Andhra University College of Engineering, Visakhapatnam, Andhra Pradesh",
  "Gayatri Vidya Parishad College of Engineering, Visakhapatnam, Andhra Pradesh",
  "GITAM University, Visakhapatnam, Andhra Pradesh",
  "Vignan's Foundation for Science Technology and Research, Guntur, Andhra Pradesh",
  "K L University, Guntur, Andhra Pradesh",
  "Anil Neerukonda Institute of Technology and Sciences, Visakhapatnam, Andhra Pradesh",
  "R.V.R. & J.C. College of Engineering, Guntur, Andhra Pradesh",
  "Sree Vidyanikethan Engineering College, Tirupati, Andhra Pradesh",
  "National Institute of Technology Arunachal Pradesh, Itanagar, Arunachal Pradesh",
  "Indian Institute of Technology Guwahati (IIT Guwahati), Guwahati, Assam",
  "National Institute of Technology Silchar, Silchar, Assam",
  "Assam Engineering College (AEC), Guwahati, Assam",
  "Jorhat Engineering College, Jorhat, Assam",
  "Royal Global University, Guwahati, Assam",
  "Don Bosco College of Engineering and Technology, Guwahati, Assam",
  "Indian Institute of Technology Patna (IIT Patna), Patna, Bihar",
  "National Institute of Technology Patna, Patna, Bihar",
  "Punjab Engineering College (PEC), Chandigarh",
  "Indian Institute of Technology Bhilai (IIT Bhilai), Bhilai, Chhattisgarh",
  "National Institute of Technology Raipur, Raipur, Chhattisgarh",
  "Government Engineering College, Raipur, Chhattisgarh",
  "Bhilai Institute of Technology, Durg, Chhattisgarh",
  "Rungta College of Engineering and Technology, Bhilai, Chhattisgarh",
  "Delhi Technological University (DTU), Delhi",
  "Netaji Subhas University of Technology (NSUT), Delhi",
  "Indira Gandhi Delhi Technical University for Women (IGDTUW), Delhi",
  "Jamia Millia Islamia, Delhi",
  "Guru Gobind Singh Indraprastha University (GGSIPU), Delhi",
  "Maharaja Agrasen Institute of Technology (MAIT), Delhi",
  "Indraprastha Institute of Information Technology Delhi (IIITD), Delhi",
  "Netaji Subhas Institute of Technology (NSIT), Delhi",
  "Bharati Vidyapeeth's College of Engineering, Delhi",
  "Vivekananda Institute of Professional Studies (VIPS), Delhi",
  "Padre Conceicao College of Engineering, Verna, Goa",
  "Indian Institute of Technology Goa (IIT Goa), Goa",
  "National Institute of Technology Goa, Goa",
  "BITS Pilani - Goa Campus, Goa",
  "Indian Institute of Technology Gandhinagar (IIT Gandhinagar), Gandhinagar, Gujarat",
  "Sardar Vallabhbhai National Institute of Technology (SVNIT), Surat, Gujarat",
  "Indian Institute of Information Technology Vadodara, Vadodara, Gujarat",
  "Dhirubhai Ambani Institute of Information and Communication Technology (DA-IICT), Gandhinagar, Gujarat",
  "L.D. College of Engineering, Ahmedabad, Gujarat",
  "Gujarat Technological University (GTU), Ahmedabad, Gujarat",
  "Nirma University, Ahmedabad, Gujarat",
  "Pandit Deendayal Energy University, Gandhinagar, Gujarat",
  "Charusat University, Anand, Gujarat",
  "Devang Patel Institute of Advance Technology and Research (DEPSTAR), Anand, Gujarat",
  "G.H. Patel College of Engineering and Technology (GCET), Anand, Gujarat",
  "Marwadi University, Rajkot, Gujarat",
  "Silver Oak University, Ahmedabad, Gujarat",
  "Indus University, Ahmedabad, Gujarat",
  "Parul University, Vadodara, Gujarat",
  "BVM Engineering College, Anand, Gujarat",
  "National Institute of Technology Kurukshetra, Kurukshetra, Haryana",
  "SRM University Delhi-NCR, Sonipat, Haryana",
  "O.P. Jindal Global University, Sonipat, Haryana",
  "Ashoka University, Sonipat, Haryana",
  "Maharishi Markandeshwar University, Ambala, Haryana",
  "Kurukshetra University, Kurukshetra, Haryana",
  "J.C. Bose University of Science and Technology, Faridabad, Haryana",
  "Deenbandhu Chhotu Ram University of Science and Technology, Murthal, Haryana",
  "Indian Institute of Technology Mandi (IIT Mandi), Mandi, Himachal Pradesh",
  "National Institute of Technology Hamirpur, Hamirpur, Himachal Pradesh",
  "Indian Institute of Information Technology Una, Una, Himachal Pradesh",
  "Jaypee University of Information Technology, Solan, Himachal Pradesh",
  "Himachal Pradesh University, Shimla, Himachal Pradesh",
  "Indian Institute of Technology Jammu (IIT Jammu), Jammu, J&K",
  "National Institute of Technology Srinagar, Srinagar, J&K",
  "BIT Mesra, Ranchi, Jharkhand",
  "Jharkhand University of Technology (JUT), Ranchi, Jharkhand",
  "National Institute of Technology Jamshedpur, Jamshedpur, Jharkhand",
  "Indian Institute of Technology Dharwad (IIT Dharwad), Dharwad, Karnataka",
  "National Institute of Technology Surathkal (NITK), Surathkal, Karnataka",
  "International Institute of Information Technology Bangalore (IIIT-B), Bengaluru, Karnataka",
  "Indian Institute of Information Technology Dharwad, Dharwad, Karnataka",
  "Manipal Institute of Technology (MIT), Manipal, Karnataka",
  "MAHE Manipal, Manipal, Karnataka",
  "Amity University Bengaluru, Bengaluru, Karnataka",
  "Indian Institute of Science (IISc), Bengaluru, Karnataka",
  "R.V. College of Engineering (RVCE), Bengaluru, Karnataka",
  "PES University, Bengaluru, Karnataka",
  "M.S. Ramaiah Institute of Technology (MSRIT), Bengaluru, Karnataka",
  "BMS College of Engineering, Bengaluru, Karnataka",
  "Dayananda Sagar College of Engineering (DSCE), Bengaluru, Karnataka",
  "JSS Academy of Technical Education, Bengaluru, Karnataka",
  "Siddaganga Institute of Technology, Tumkur, Karnataka",
  "The National Institute of Engineering, Mysuru, Karnataka",
  "Malnad College of Engineering, Hassan, Karnataka",
  "Sri Jayachamarajendra College of Engineering (SJCE), Mysuru, Karnataka",
  "Nitte Meenakshi Institute of Technology, Bengaluru, Karnataka",
  "CMR Institute of Technology, Bengaluru, Karnataka",
  "REVA University, Bengaluru, Karnataka",
  "Christ University, Bengaluru, Karnataka",
  "Presidency University, Bengaluru, Karnataka",
  "Bangalore Institute of Technology (BIT), Bengaluru, Karnataka",
  "MVJ College of Engineering, Bengaluru, Karnataka",
  "New Horizon College of Engineering, Bengaluru, Karnataka",
  "Sapthagiri College of Engineering, Bengaluru, Karnataka",
  "KLE Technological University, Hubli, Karnataka",
  "Basaveshwar Engineering College, Bagalkot, Karnataka",
  "Government Engineering College, Haveri, Karnataka",
  "SDM College of Engineering and Technology, Dharwad, Karnataka",
  "BVVS Polytechnic, Bagalkot, Karnataka",
  "Indian Institute of Technology Palakkad (IIT Palakkad), Palakkad, Kerala",
  "National Institute of Technology Calicut (NIT Calicut), Kozhikode, Kerala",
  "Government Engineering College Thrissur, Thrissur, Kerala",
  "College of Engineering Trivandrum (CET), Thiruvananthapuram, Kerala",
  "TKM College of Engineering, Kollam, Kerala",
  "Mar Athanasius College of Engineering, Kothamangalam, Kerala",
  "Rajagiri School of Engineering and Technology, Ernakulam, Kerala",
  "Model Engineering College (MEC), Ernakulam, Kerala",
  "Cochin University of Science and Technology (CUSAT), Kochi, Kerala",
  "APJ Abdul Kalam Technological University, Thiruvananthapuram, Kerala",
  "Government College of Engineering Kannur, Kannur, Kerala",
  "LBS Institute of Technology for Women, Thiruvananthapuram, Kerala",
  "Federal Institute of Science and Technology (FISAT), Ernakulam, Kerala",
  "Viswajyothi College of Engineering and Technology, Ernakulam, Kerala",
  "Toc H Institute of Science and Technology, Ernakulam, Kerala",
  "Amrita School of Engineering, Kochi, Kerala",
  "Indian Institute of Technology Indore (IIT Indore), Indore, Madhya Pradesh",
  "Maulana Azad National Institute of Technology (MANIT), Bhopal, Madhya Pradesh",
  "Indian Institute of Information Technology Gwalior (IIITM), Gwalior, Madhya Pradesh",
  "VIT Bhopal University, Bhopal, Madhya Pradesh",
  "Indian Institute of Information Technology and Management Gwalior, Gwalior, Madhya Pradesh",
  "MITS Gwalior, Gwalior, Madhya Pradesh",
  "Jabalpur Engineering College (JEC), Jabalpur, Madhya Pradesh",
  "Sagar Institute of Research and Technology (SIRT), Bhopal, Madhya Pradesh",
  "Lakshmi Narain College of Technology, Bhopal, Madhya Pradesh",
  "Acropolis Institute of Technology and Research, Indore, Madhya Pradesh",
  "IET DAVV, Indore, Madhya Pradesh",
  "Shri Govindram Seksaria Institute of Technology and Science (SGSITS), Indore, Madhya Pradesh",
  "Oriental Institute of Science and Technology, Bhopal, Madhya Pradesh",
  "RKDF University, Bhopal, Madhya Pradesh",
  "National Institute of Technology Manipur, Imphal, Manipur",
  "Indian Institute of Information Technology Manipur, Imphal, Manipur",
  "National Institute of Technology Meghalaya, Shillong, Meghalaya",
  "National Institute of Technology Mizoram, Aizawl, Mizoram",
  "National Institute of Technology Nagaland, Dimapur, Nagaland",
  "Indian Institute of Technology Delhi (IIT Delhi), New Delhi",
  "Indian Institute of Technology Bhubaneswar (IIT Bhubaneswar), Bhubaneswar, Odisha",
  "National Institute of Technology Rourkela (NIT Rourkela), Rourkela, Odisha",
  "Kalinga Institute of Industrial Technology (KIIT), Bhubaneswar, Odisha",
  "ITER Siksha O Anusandhan University, Bhubaneswar, Odisha",
  "C.V. Raman Global University, Bhubaneswar, Odisha",
  "Trident Academy of Technology, Bhubaneswar, Odisha",
  "Parala Maharaja Engineering College, Berhampur, Odisha",
  "National Institute of Technology Puducherry, Puducherry",
  "Indian Institute of Technology Ropar (IIT Ropar), Ropar, Punjab",
  "National Institute of Technology Jalandhar, Jalandhar, Punjab",
  "Thapar Institute of Engineering and Technology, Patiala, Punjab",
  "Lovely Professional University (LPU), Phagwara, Punjab",
  "Chandigarh University, Chandigarh, Punjab",
  "Chitkara University, Rajpura, Punjab",
  "Guru Nanak Dev Engineering College (GNDEC), Ludhiana, Punjab",
  "Punjab Technical University (PTU), Jalandhar, Punjab",
  "Dr. B.R. Ambedkar National Institute of Technology, Jalandhar, Punjab",
  "Indian Institute of Technology Jodhpur (IIT Jodhpur), Jodhpur, Rajasthan",
  "National Institute of Technology Jaipur (MNIT), Jaipur, Rajasthan",
  "Indian Institute of Information Technology Kota, Kota, Rajasthan",
  "BITS Pilani, Pilani, Rajasthan",
  "Malaviya National Institute of Technology (MNIT), Jaipur, Rajasthan",
  "Government Engineering College Ajmer, Ajmer, Rajasthan",
  "Rajasthan Technical University (RTU), Kota, Rajasthan",
  "Poornima University, Jaipur, Rajasthan",
  "Jaipur Engineering College and Research Centre (JECRC), Jaipur, Rajasthan",
  "Manipal University Jaipur, Jaipur, Rajasthan",
  "LNM Institute of Information Technology (LNMIIT), Jaipur, Rajasthan",
  "Arya College of Engineering and IT, Jaipur, Rajasthan",
  "Swami Keshvanand Institute of Technology (SKIT), Jaipur, Rajasthan",
  "University of Engineering and Management, Jaipur, Rajasthan",
  "National Institute of Technology Sikkim, Gangtok, Sikkim",
  "Indian Institute of Technology Madras (IIT Madras), Chennai, Tamil Nadu",
  "National Institute of Technology Trichy (NIT Trichy), Tiruchirappalli, Tamil Nadu",
  "Indian Institute of Information Technology Design and Manufacturing, Chennai, Tamil Nadu",
  "Indian Institute of Information Technology Tiruchirappalli, Tiruchirappalli, Tamil Nadu",
  "Vellore Institute of Technology (VIT), Vellore, Tamil Nadu",
  "VIT University Chennai Campus, Chennai, Tamil Nadu",
  "SRM Institute of Science and Technology, Kattankulathur, Tamil Nadu",
  "Anna University, Chennai, Tamil Nadu",
  "College of Engineering Guindy (CEG), Chennai, Tamil Nadu",
  "PSG College of Technology, Coimbatore, Tamil Nadu",
  "Coimbatore Institute of Technology (CIT), Coimbatore, Tamil Nadu",
  "Amrita School of Engineering, Coimbatore, Tamil Nadu",
  "Sri Venkateswara College of Engineering, Sriperumbudur, Tamil Nadu",
  "SSN College of Engineering, Chennai, Tamil Nadu",
  "Kongu Engineering College, Erode, Tamil Nadu",
  "Bannari Amman Institute of Technology, Sathyamangalam, Tamil Nadu",
  "Kumaraguru College of Technology (KCT), Coimbatore, Tamil Nadu",
  "Thiagarajar College of Engineering (TCE), Madurai, Tamil Nadu",
  "Government College of Engineering, Salem, Tamil Nadu",
  "Sri Krishna College of Engineering and Technology, Coimbatore, Tamil Nadu",
  "Karpagam College of Engineering, Coimbatore, Tamil Nadu",
  "RMK Engineering College, Chennai, Tamil Nadu",
  "Rajalakshmi Engineering College, Chennai, Tamil Nadu",
  "Saveetha Engineering College, Chennai, Tamil Nadu",
  "B.S. Abdur Rahman Crescent Institute, Chennai, Tamil Nadu",
  "Vel Tech Rangarajan Dr. Sagunthala R&D Institute, Chennai, Tamil Nadu",
  "Sona College of Technology, Salem, Tamil Nadu",
  "Mepco Schlenk Engineering College, Virudhunagar, Tamil Nadu",
  "Kalasalingam Academy of Research and Education, Krishnankoil, Tamil Nadu",
  "National Engineering College, Kovilpatti, Tamil Nadu",
  "Indian Institute of Technology Hyderabad (IIT Hyderabad), Hyderabad, Telangana",
  "National Institute of Technology Warangal (NIT Warangal), Warangal, Telangana",
  "International Institute of Information Technology Hyderabad (IIIT-H), Hyderabad, Telangana",
  "BITS Pilani - Hyderabad Campus, Hyderabad, Telangana",
  "Osmania University College of Engineering, Hyderabad, Telangana",
  "Jawaharlal Nehru Technological University (JNTUH), Hyderabad, Telangana",
  "Vasavi College of Engineering, Hyderabad, Telangana",
  "Chaitanya Bharathi Institute of Technology (CBIT), Hyderabad, Telangana",
  "CVR College of Engineering, Hyderabad, Telangana",
  "Gokaraju Rangaraju Institute of Engineering and Technology (GRIET), Hyderabad, Telangana",
  "Malla Reddy Engineering College, Hyderabad, Telangana",
  "Mahatma Gandhi Institute of Technology (MGIT), Hyderabad, Telangana",
  "SR Engineering College, Warangal, Telangana",
  "Kakatiya Institute of Technology and Science (KITS), Warangal, Telangana",
  "National Institute of Technology Agartala, Agartala, Tripura",
  "Indian Institute of Technology Kanpur (IIT Kanpur), Kanpur, Uttar Pradesh",
  "Motilal Nehru National Institute of Technology (MNNIT), Allahabad, Uttar Pradesh",
  "Indian Institute of Information Technology Allahabad (IIITA), Allahabad, Uttar Pradesh",
  "Indian Institute of Information Technology Lucknow, Lucknow, Uttar Pradesh",
  "Amity University, Noida, Uttar Pradesh",
  "Shiv Nadar University, Greater Noida, Uttar Pradesh",
  "Bennett University, Greater Noida, Uttar Pradesh",
  "Indian Institute of Technology (BHU), Varanasi, Uttar Pradesh",
  "Harcourt Butler Technical University (HBTU), Kanpur, Uttar Pradesh",
  "Aligarh Muslim University, Aligarh, Uttar Pradesh",
  "Ajay Kumar Garg Engineering College, Ghaziabad, Uttar Pradesh",
  "G.L. Bajaj Institute of Technology and Management, Greater Noida, Uttar Pradesh",
  "Galgotias College of Engineering and Technology, Greater Noida, Uttar Pradesh",
  "Galgotias University, Greater Noida, Uttar Pradesh",
  "KIET Group of Institutions, Ghaziabad, Uttar Pradesh",
  "JSS Academy of Technical Education, Noida, Uttar Pradesh",
  "Noida Institute of Engineering and Technology (NIET), Greater Noida, Uttar Pradesh",
  "Raj Kumar Goel Institute of Technology (RKGIT), Ghaziabad, Uttar Pradesh",
  "Institute of Engineering and Technology, Lucknow, Uttar Pradesh",
  "Dr. A.P.J. Abdul Kalam Technical University (AKTU), Lucknow, Uttar Pradesh",
  "Babu Banarasi Das University, Lucknow, Uttar Pradesh",
  "Indian Institute of Technology Roorkee (IIT Roorkee), Roorkee, Uttarakhand",
  "National Institute of Technology Uttarakhand, Srinagar, Uttarakhand",
  "Indian Institute of Technology Kharagpur (IIT KGP), Kharagpur, West Bengal",
  "National Institute of Technology Durgapur, Durgapur, West Bengal",
  "Indian Institute of Information Technology Kalyani, Kalyani, West Bengal",
  "Jadavpur University, Kolkata, West Bengal",
  "Heritage Institute of Technology, Kolkata, West Bengal",
  "Techno India University, Kolkata, West Bengal",
  "Netaji Subhash Engineering College, Kolkata, West Bengal",
  "Institute of Engineering and Management (IEM), Kolkata, West Bengal",
  "Meghnad Saha Institute of Technology, Kolkata, West Bengal",
  "Sister Nivedita University, Kolkata, West Bengal",
  "Narula Institute of Technology, Kolkata, West Bengal",
  "West Bengal University of Technology (MAKAUT), Kolkata, West Bengal",
  "College of Engineering and Management, Kolaghat, West Bengal",
  "Other",
];

let selectedCollege = null;

function initCollegeSearch() {
  const searchInput = $('college_search');
  const dropdown    = $('college_dropdown');
  const selectedDiv = $('college_selected');
  const selectedTxt = $('college_selected_text');
  const clearBtn    = $('college_clear_btn');
  if (!searchInput) return;

  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    if (!q) { dropdown.style.display = 'none'; return; }

    const matches = ALL_COLLEGES.filter(c => c.toLowerCase().includes(q)).slice(0, 20);
    if (!matches.length) { dropdown.style.display = 'none'; return; }

    dropdown.innerHTML = matches.map(c => {
      const hi = c.replace(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})`, 'gi'), '<mark>$1</mark>');
      return `<div class="college-option" data-val="${c}">${hi}</div>`;
    }).join('');

    dropdown.style.display = 'block';

    dropdown.querySelectorAll('.college-option').forEach(opt => {
      opt.addEventListener('click', () => {
        setCollege(opt.dataset.val);
      });
    });
  });

  searchInput.addEventListener('keydown', e => {
    if (e.key === 'Escape') dropdown.style.display = 'none';
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.style.display = 'none';
    }
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      selectedCollege = null;
      selectedToggles.college = null;
      searchInput.value = '';
      selectedDiv.style.display = 'none';
      searchInput.style.display = '';
      searchInput.focus();
    });
  }
}

function setCollege(name) {
  selectedCollege = name;
  selectedToggles.college = name;
  const searchInput = $('college_search');
  const dropdown    = $('college_dropdown');
  const selectedDiv = $('college_selected');
  const selectedTxt = $('college_selected_text');
  if (searchInput)  searchInput.style.display = 'none';
  if (dropdown)     dropdown.style.display = 'none';
  if (selectedDiv)  selectedDiv.style.display = '';
  if (selectedTxt)  selectedTxt.textContent = name;
  triggerAutoSave();
}


function initToggles() {
  ['gender','degree','specialization','prevDegree','backlogs'].forEach(group => {
    const c = $('tc_' + group);
    if (!c) return;
    c.querySelectorAll('.tc').forEach(tc => {
      tc.addEventListener('click', () => {
        c.querySelectorAll('.tc').forEach(x => x.classList.remove('sel'));
        tc.classList.add('sel');
        selectedToggles[group] = tc.dataset.val;
      });
    });
  });

  // skillset: multi
  const ss = $('tc_skillset');
  if (ss) {
    ss.querySelectorAll('.tc').forEach(tc => {
      tc.addEventListener('click', () => {
        tc.classList.toggle('sel');
        const v = tc.dataset.val;
        if (tc.classList.contains('sel')) {
          if (!selectedToggles.skillset.includes(v)) selectedToggles.skillset.push(v);
        } else {
          selectedToggles.skillset = selectedToggles.skillset.filter(x => x !== v);
        }
      });
    });
  }
}

// ═══════════════════════════════════════════════════════════
// RATING CHIPS
// ═══════════════════════════════════════════════════════════
function initRatings() {
  ['codechef','hackerrank'].forEach(key => {
    const c = $('rc_' + key);
    if (!c) return;
    c.querySelectorAll('.rc').forEach(rc => {
      rc.addEventListener('click', () => {
        c.querySelectorAll('.rc').forEach(x => x.classList.remove('sel'));
        rc.classList.add('sel');
        selectedRatings[key] = rc.dataset.val;
      });
    });
  });
}

// ═══════════════════════════════════════════════════════════
// YES/NO CERT
// ═══════════════════════════════════════════════════════════
function setYN(val) {
  certHasDone = val;
  $('yn_yes').classList.toggle('sel', val === 'Yes');
  $('yn_no').classList.toggle('sel', val === 'No');
  $('cert_fields').style.display = val === 'Yes' ? '' : 'none';
}

function initYN() {
  const yes = $('yn_yes'), no = $('yn_no');
  if (yes) yes.addEventListener('click', () => setYN('Yes'));
  if (no)  no.addEventListener('click',  () => setYN('No'));
  setYN('No');
}

// ═══════════════════════════════════════════════════════════
// SKILLS CHIPS
// ═══════════════════════════════════════════════════════════
function addSkill() {
  const input = $('skillInput');
  if (!input) return;
  const v = input.value.trim();
  if (!v || skills.includes(v)) { input.value = ''; return; }
  skills.push(v);
  input.value = '';
  renderSkills();
}

function removeSkill(s) {
  skills = skills.filter(x => x !== s);
  renderSkills();
}

function renderSkills() {
  const c = $('skillChips');
  if (!c) return;
  c.innerHTML = skills.map(s =>
    `<span class="chip">${s}<button class="chip-x" data-skill="${s}">×</button></span>`
  ).join('');
  c.querySelectorAll('.chip-x').forEach(btn => {
    btn.addEventListener('click', () => removeSkill(btn.dataset.skill));
  });
}

function initSkills() {
  const input = $('skillInput');
  if (input) {
    input.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } });
  }
  const addBtn = $('skillAddBtn');
  if (addBtn) addBtn.addEventListener('click', addSkill);
}

// ═══════════════════════════════════════════════════════════
// GOOGLE FORMS BUILDER
// ═══════════════════════════════════════════════════════════
function initBuilder() {
  // Type button toggle
  const typeBtn = $('gf-type-btn');
  if (typeBtn) {
    typeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const menu = $('gf-type-menu');
      menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    });
  }

  // Close menu on outside click
  document.addEventListener('click', () => {
    const menu = $('gf-type-menu');
    if (menu) menu.style.display = 'none';
  });

  // Type option clicks
  const menu = $('gf-type-menu');
  if (menu) {
    menu.addEventListener('click', e => {
      e.stopPropagation();
      const opt = e.target.closest('.gf-type-option');
      if (!opt) return;
      selectType(opt.dataset.type, TYPE_LABELS[opt.dataset.type]);
    });
  }

  // Add option button
  const addOptBtn = $('gf-add-option-btn');
  if (addOptBtn) addOptBtn.addEventListener('click', addBuilderOption);

  // Save field button
  const saveBtn = $('gf-save-btn');
  if (saveBtn) saveBtn.addEventListener('click', saveCustomField);

  // Init with short answer
  selectType('short', 'Short answer');
}

function selectType(type, label) {
  gfType = type;
  const menu = $('gf-type-menu');
  if (menu) menu.style.display = 'none';

  const labelEl = $('gf-type-label-text');
  if (labelEl) labelEl.textContent = label;

  // Mark active in menu
  document.querySelectorAll('.gf-type-option').forEach(o => {
    o.classList.toggle('sel', o.dataset.type === type);
  });

  const hasOptions = ['radio','checkbox','dropdown'].includes(type);

  // Show/hide options section
  const optArea = $('gf-options-area');
  if (optArea) optArea.style.display = hasOptions ? '' : 'none';

  // Seed one option if switching to options type with none
  if (hasOptions && gfOptions.length === 0) {
    gfOptions = ['Option 1'];
  }
  if (hasOptions) renderBuilderOptions();

  renderAnswerPreview();
  renderYourAnswerInput();
}

function renderAnswerPreview() {
  const area = $('gf-answer-area');
  if (!area) return;
  const hasOptions = ['radio','checkbox','dropdown'].includes(gfType);
  if (hasOptions) { area.innerHTML = ''; return; }

  const map = {
    short:     `<input class="gf-preview-short" disabled placeholder="Short answer text"/>`,
    paragraph: `<textarea class="gf-preview-para" rows="2" disabled placeholder="Long answer text"></textarea>`,
    date:      `<div class="gf-preview-date"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg><span>MM / DD / YYYY</span></div>`,
    time:      `<div class="gf-preview-date"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg><span>HH : MM</span></div>`,
    number:    `<input class="gf-preview-short" disabled placeholder="Number"/>`,
    url:       `<input class="gf-preview-short" disabled placeholder="https://..."/>`,
  };
  area.innerHTML = map[gfType] || '';
}

function renderYourAnswerInput() {
  const wrap = $('cf_value_wrap');
  const row  = $('gf-your-answer-row');
  if (!wrap || !row) return;

  const hasOptions = ['radio','checkbox','dropdown'].includes(gfType);
  row.style.display = '';

  if (hasOptions) {
    const opts = gfOptions.map(o => `<option value="${o}">${o}</option>`).join('');
    wrap.innerHTML = `<select id="cf_value_sel"><option value="">-- Select the option that applies to you --</option>${opts}</select>`;
    return;
  }

  const map = {
    short:     `<input id="cf_value" type="text" placeholder="Your answer"/>`,
    paragraph: `<textarea id="cf_value" rows="3" placeholder="Your answer"></textarea>`,
    date:      `<input id="cf_value" type="date"/>`,
    time:      `<input id="cf_value" type="time"/>`,
    number:    `<input id="cf_value" type="number" placeholder="0"/>`,
    url:       `<input id="cf_value" type="url" placeholder="https://"/>`,
  };
  wrap.innerHTML = map[gfType] || `<input id="cf_value" type="text" placeholder="Your answer"/>`;
}

function renderBuilderOptions() {
  const list = $('gf-options-list');
  if (!list) return;
  const isCheck = gfType === 'checkbox';
  const isDrop  = gfType === 'dropdown';

  list.innerHTML = gfOptions.map((opt, i) => {
    let icon = '';
    if (isDrop) {
      icon = `<span class="gf-opt-num">${i+1}.</span>`;
    } else if (isCheck) {
      icon = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>`;
    } else {
      icon = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>`;
    }
    return `<div class="gf-option-item" data-idx="${i}">
      <div class="gf-option-icon">${icon}</div>
      <input class="gf-option-input" value="${opt}" placeholder="Option ${i+1}" data-idx="${i}"/>
      <button class="gf-option-del" data-idx="${i}" title="Remove">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>`;
  }).join('');

  // Bind events
  list.querySelectorAll('.gf-option-input').forEach(inp => {
    inp.addEventListener('input', () => {
      gfOptions[parseInt(inp.dataset.idx)] = inp.value;
      syncDropdownOptions();
    });
  });
  list.querySelectorAll('.gf-option-del').forEach(btn => {
    btn.addEventListener('click', () => removeBuilderOption(parseInt(btn.dataset.idx)));
  });

  syncDropdownOptions();
}

function addBuilderOption() {
  gfOptions.push('Option ' + (gfOptions.length + 1));
  renderBuilderOptions();
  renderYourAnswerInput();
}

function removeBuilderOption(i) {
  if (gfOptions.length <= 1) { toast('Need at least 1 option', 'err'); return; }
  gfOptions.splice(i, 1);
  renderBuilderOptions();
  renderYourAnswerInput();
}

function syncDropdownOptions() {
  const sel = $('cf_value_sel');
  if (!sel) return;
  const cur = sel.value;
  sel.innerHTML = `<option value="">-- Select the option that applies to you --</option>` +
    gfOptions.map(o => `<option value="${o}"${o===cur?' selected':''}>${o}</option>`).join('');
}

// ═══════════════════════════════════════════════════════════
// SAVE CUSTOM FIELD
// ═══════════════════════════════════════════════════════════
function saveCustomField() {
  const labelEl = $('cf_label');
  if (!labelEl) return;
  const label = labelEl.value.trim();
  if (!label) { toast('Enter a question label', 'err'); return; }

  const isDup = customFields.some(f => f.label.toLowerCase() === label.toLowerCase());
  if (isDup) { toast('This field already exists', 'err'); return; }

  const hasOptions = ['radio','checkbox','dropdown'].includes(gfType);
  let value = '';

  if (hasOptions) {
    const sel = $('cf_value_sel');
    value = sel ? sel.value : '';
  } else {
    const inp = $('cf_value');
    value = inp ? inp.value.trim() : '';
  }

  if (!value) { toast('Enter your answer first', 'err'); return; }

  customFields.push({
    label,
    value,
    type: gfType,
    typeLabel: TYPE_LABELS[gfType],
    options: hasOptions ? [...gfOptions] : []
  });

  // Reset builder
  labelEl.value = '';
  gfOptions = [];
  selectType('short', 'Short answer');

  chrome.storage.local.set({ tnpCustomFields: customFields }, () => {
    renderCustomList();
    toast('Field saved!');
  });
}

function removeCustomField(idx) {
  customFields.splice(idx, 1);
  chrome.storage.local.set({ tnpCustomFields: customFields }, () => {
    renderCustomList();
    toast('Field removed');
  });
}

function renderCustomList() {
  const el = $('customList');
  if (!el) return;
  if (!customFields.length) {
    el.innerHTML = `<div class="cf-empty">No custom fields yet. Add one below.</div>`;
    return;
  }
  el.innerHTML = customFields.map((f, i) =>
    `<div class="cf-item">
      <div class="cf-info">
        <div class="cf-name">${f.label}</div>
        <div class="cf-val">${f.value}</div>
      </div>
      <div class="cf-type-badge">${TYPE_ICONS_SVG[f.type]||''}${f.typeLabel||f.type}</div>
      <button class="cf-del" data-idx="${i}" title="Delete">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
          <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
        </svg>
      </button>
    </div>`
  ).join('');

  el.querySelectorAll('.cf-del').forEach(btn => {
    btn.addEventListener('click', () => removeCustomField(parseInt(btn.dataset.idx)));
  });
}

// ═══════════════════════════════════════════════════════════
// PROFILE — BUILD + SAVE + LOAD
// ═══════════════════════════════════════════════════════════
function buildProfile() {
  const fn = gval('p_firstName'), ln = gval('p_lastName');
  return {
    firstName:        fn,
    lastName:         ln,
    fullName:         gval('p_fullName') || (fn && ln ? fn + ' ' + ln : fn || ln),
    email:            gval('p_email'),
    phone:            gval('p_phone'),
    dob:              gval('p_dob'),
    gender:           selectedToggles.gender,
    prn:              gval('p_prn'),
    enrollment:       gval('p_enrollment'),
    degree:           selectedToggles.degree,
    specialization:   selectedToggles.specialization,
    college:          selectedToggles.college,
    division:         gval('p_division'),
    batch:            gval('p_batch'),
    tenth:            gval('p_tenth'),
    twelfth:          gval('p_twelfth'),
    prevDegree:       selectedToggles.prevDegree,
    bepercent:        gval('p_bepercent'),
    cgpa:             gval('p_cgpa'),
    pgpercent:        gval('p_pgpercent'),
    skillset:         selectedToggles.skillset.join(', '),
    skills:           skills,
    certDone:         certHasDone,
    certPlatform:     gval('p_certPlatform'),
    certHours:        gval('p_certHours'),
    codechefRating:   selectedRatings.codechef,
    codechefUrl:      gval('p_codechefUrl'),
    hackerrankRating: selectedRatings.hackerrank,
    hackerrankUrl:    gval('p_hackerrankUrl'),
    leetcode:         gval('p_leetcode'),
    leetcodeUrl:      gval('p_leetcodeUrl'),
    cocubes:          gval('p_cocubes'),
    github:           gval('p_github'),
    linkedin:         gval('p_linkedin'),
    resume:           gval('p_resume'),
    techAchiev:       gval('p_techAchiev'),
    persAchiev:       gval('p_persAchiev'),
    projects:         gval('p_projects'),
    address:          gval('p_address'),
    backlogs:         selectedToggles.backlogs,
  };
}

function saveProfile() {
  const profile = buildProfile();
  if (!profile.firstName && !profile.email) {
    toast('Fill at least name or email', 'err'); return;
  }
  chrome.storage.local.set({ tnpProfile: profile }, () => {
    toast('Profile saved!');
    refreshFillPanel();
  });
}

function loadProfileIntoForm(p) {
  const setv = (id, v) => { const el = $(id); if (el && v != null && v !== '') el.value = v; };
  setv('p_firstName', p.firstName);   setv('p_lastName', p.lastName);
  setv('p_fullName',  p.fullName);    setv('p_email', p.email);
  setv('p_phone',     p.phone);       setv('p_dob', p.dob);
  setv('p_prn',       p.prn);         setv('p_enrollment', p.enrollment);
  setv('p_division',  p.division);    setv('p_batch', p.batch);
  setv('p_tenth',     p.tenth);       setv('p_twelfth', p.twelfth);
  setv('p_bepercent', p.bepercent);   setv('p_cgpa', p.cgpa);
  setv('p_pgpercent', p.pgpercent);
  setv('p_certPlatform', p.certPlatform); setv('p_certHours', p.certHours);
  setv('p_codechefUrl', p.codechefUrl);   setv('p_hackerrankUrl', p.hackerrankUrl);
  setv('p_leetcode', p.leetcode);         setv('p_leetcodeUrl', p.leetcodeUrl);
  setv('p_cocubes',  p.cocubes);
  setv('p_github',   p.github);       setv('p_linkedin', p.linkedin);
  setv('p_resume',   p.resume);
  setv('p_techAchiev', p.techAchiev); setv('p_persAchiev', p.persAchiev);
  setv('p_projects', p.projects);     setv('p_address', p.address);

  // Single-select toggles (no college — uses search)
  ['gender','degree','specialization','prevDegree','backlogs'].forEach(g => {
    if (!p[g]) return;
    selectedToggles[g] = p[g];
    const c = $('tc_' + g);
    if (!c) return;
    c.querySelectorAll('.tc').forEach(tc => tc.classList.toggle('sel', tc.dataset.val === p[g]));
  });

  // College search restore
  if (p.college) setCollege(p.college);

  // Multi skillset
  if (p.skillset) {
    const vals = p.skillset.split(', ').filter(Boolean);
    selectedToggles.skillset = vals;
    const c = $('tc_skillset');
    if (c) c.querySelectorAll('.tc').forEach(tc => tc.classList.toggle('sel', vals.includes(tc.dataset.val)));
  }

  // Skills chips
  if (Array.isArray(p.skills) && p.skills.length) { skills = [...p.skills]; renderSkills(); }

  // Cert
  if (p.certDone) setYN(p.certDone);

  // Ratings
  if (p.codechefRating != null) {
    selectedRatings.codechef = String(p.codechefRating);
    const c = $('rc_codechef');
    if (c) c.querySelectorAll('.rc').forEach(rc => rc.classList.toggle('sel', rc.dataset.val === String(p.codechefRating)));
  }
  if (p.hackerrankRating != null) {
    selectedRatings.hackerrank = String(p.hackerrankRating);
    const c = $('rc_hackerrank');
    if (c) c.querySelectorAll('.rc').forEach(rc => rc.classList.toggle('sel', rc.dataset.val === String(p.hackerrankRating)));
  }
}

// ═══════════════════════════════════════════════════════════
// FILL PANEL
// ═══════════════════════════════════════════════════════════
function refreshFillPanel() {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    const tab = tabs[0];
    const onForm = !!(tab && tab.url && tab.url.includes('docs.google.com/forms'));

    const dot  = $('sdot');
    const stxt = $('stext');
    if (dot)  dot.className  = 'sdot' + (onForm ? ' live' : ' warn');
    if (stxt) stxt.textContent = onForm ? 'Google Form detected — ready!' : 'Open a Google Form first';

    chrome.storage.local.get(['tnpProfile'], r => {
      const p   = r.tnpProfile;
      const has = !!(p && (p.firstName || p.email));

      const noWrap = $('no-profile-wrap');
      const pcWrap = $('pcard-wrap');
      const btn    = $('fillBtn');
      const res    = $('fillResult');

      if (noWrap) noWrap.style.display = has ? 'none' : '';
      if (pcWrap) {
        if (has) {
          const rows = [
            ['Name',    p.fullName || (p.firstName||'') + ' ' + (p.lastName||'')],
            ['Email',   p.email],
            ['Phone',   p.phone],
            ['PRN',     p.prn],
            ['Degree',  p.degree],
            ['College', p.college ? (p.college.split("'s ")[1]||'').split(',')[0] || p.college : ''],
            ['Branch',  p.specialization],
            ['CGPA',    p.cgpa],
            ['Batch',   p.batch],
            ['GitHub',  p.github],
          ].filter(([,v]) => v && v.trim());

          pcWrap.innerHTML = `<div class="pcard">
            <div class="pcard-hdr">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              Will auto-fill with your saved info
            </div>
            <div class="pcard-rows">${rows.map(([k,v]) =>
              `<div class="prow"><span class="pk">${k}</span><span class="pv">${v.trim()}</span></div>`
            ).join('')}</div>
          </div>`;
        } else {
          pcWrap.innerHTML = '';
        }
      }

      if (btn) { btn.disabled = !(has && onForm); btn.style.opacity = (has && onForm) ? '1' : '0.4'; }
      if (res) { res.textContent = ''; res.className = 'fill-result'; }
    });
  });
}

function triggerFill() {
  chrome.storage.local.get(['tnpProfile','tnpCustomFields'], r => {
    const profile = r.tnpProfile;
    const custom  = r.tnpCustomFields || [];
    if (!profile) { toast('No profile saved!', 'err'); return; }

    const btn = $('fillBtn');
    const res = $('fillResult');
    if (btn) { btn.disabled = true; btn.textContent = 'Filling...'; }

    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: autoFillGForm,
        args: [profile, custom]
      }, results => {
        const n = results?.[0]?.result ?? 0;
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Fill This Form Now`;
        }
        if (res) {
          if (n > 0) {
            res.textContent = `Filled ${n} field${n > 1 ? 's' : ''} successfully.`;
            res.className = 'fill-result good';
            toast(n + ' field' + (n > 1 ? 's' : '') + ' filled!');
          } else {
            res.textContent = 'No matching fields found on this form.';
            res.className = 'fill-result bad';
            toast('No fields matched', 'err');
          }
        }
      });
    });
  });
}

// ═══════════════════════════════════════════════════════════
// FORM FILLER (injected into Google Form tab)
// ═══════════════════════════════════════════════════════════
function autoFillGForm(profile, customFields) {
  const kmap = [
    { keys:['first name','firstname','fname'], val: profile.firstName },
    { keys:['last name','lastname','lname','surname'], val: profile.lastName },
    { keys:['full name','fullname','name','student name','candidate name','your name','applicant name'], val: profile.fullName },
    { keys:['email','e-mail','mail id','email id','email address'], val: profile.email },
    { keys:['mobile','phone','contact number','mobile number','phone number','whatsapp'], val: profile.phone },
    { keys:['date of birth','dob','birth date','birthdate','d.o.b'], val: profile.dob },
    { keys:['gender','sex'], val: profile.gender },
    { keys:['university prn','prn number','prn no','prn','permanent registration number','roll no','roll number','student id'], val: profile.prn },
    { keys:['enrollment','enrollment no','enrollment number','enroll no'], val: profile.enrollment },
    { keys:['degree','current degree','pursuing'], val: profile.degree },
    { keys:['specialization','specialisation','branch','department','dept','stream'], val: profile.specialization },
    { keys:['college','institute','college name','institution','university name','name of college','your college'], val: profile.college },
    { keys:['division','div','section'], val: profile.division },
    { keys:['year of graduation','graduation year','passout','passing year','batch','pass out year'], val: profile.batch },
    { keys:['10th','tenth','ssc','class 10','x%','10th percentage','10th marks'], val: profile.tenth },
    { keys:['12th','twelfth','hsc','class 12','xii','12th percentage','12th marks','diploma%','diploma percentage'], val: profile.twelfth },
    { keys:['which degree have you completed','degree completed','previous degree'], val: profile.prevDegree },
    { keys:['be','btech','b-tech','be b-tech%','be btech%','be percentage','b.e%'], val: profile.bepercent },
    { keys:['cgpa','cpi','gpa','current gpa','current cgpa'], val: profile.cgpa },
    { keys:['post graduation','pg%','m.tech','mca%'], val: profile.pgpercent },
    { keys:['skill sets','skill set expert','skills expert in','primary skill','skillset'], val: profile.skillset },
    { keys:['technical skills','tech skills','skills','key skills','programming skills'], val: Array.isArray(profile.skills) ? profile.skills.join(', ') : (profile.skills||'') },
    { keys:['technical course','certification','have you done','any course','course done'], val: profile.certDone },
    { keys:['agency','platform','course from','certification from','which agency','which platform'], val: profile.certPlatform },
    { keys:['duration','course duration','hours','duration of course','duration in hours'], val: profile.certHours },
    { keys:['codechef rating','codechef star','codechef score'], val: profile.codechefRating },
    { keys:['codechef profile','codechef link','codechef url','codechef profile link'], val: profile.codechefUrl || 'NA' },
    { keys:['hackerrank star','hackerrank rating','hackerrank score'], val: profile.hackerrankRating },
    { keys:['hackerrank profile','hackerrank link','hackerrank url','hackerrank profile link'], val: profile.hackerrankUrl || 'NA' },
    { keys:['leetcode score','leetcode problems','leetcode count','leet code'], val: profile.leetcode || '0' },
    { keys:['leetcode profile','leetcode link','leetcode url','leetcode profile link'], val: profile.leetcodeUrl || 'NA' },
    { keys:['cocubes','co-cubes','cocubes score'], val: profile.cocubes || '0' },
    { keys:['github','github profile','github url','github link'], val: profile.github || 'NA' },
    { keys:['linkedin','linkedin profile','linkedin url'], val: profile.linkedin },
    { keys:['resume','cv','resume link','resume url','resume drive','google drive link'], val: profile.resume },
    { keys:['technical achievement','tech achievement','technical achievements'], val: profile.techAchiev },
    { keys:['personal achievement','personal achievements','extracurricular'], val: profile.persAchiev },
    { keys:['project','projects','project in java','project in python','project description'], val: profile.projects },
    { keys:['address','city','hometown','location','current address','permanent address'], val: profile.address },
    { keys:['backlog','backlogs','active backlog','arrear','kt','back paper','number of backlogs'], val: profile.backlogs },
    ...customFields.map(cf => ({ keys: [cf.label.toLowerCase()], val: cf.value })),
  ].filter(x => x.val != null && x.val !== '');

  function norm(s) { return String(s).toLowerCase().replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim(); }

  function findVal(labelText) {
    const n = norm(labelText);
    for (const e of kmap) { if (e.keys.some(k => n.includes(k))) return e.val; }
    for (const e of kmap) { if (e.keys.some(k => k.split(' ').every(w => w.length > 2 && n.includes(w)))) return e.val; }
    return null;
  }

  function reactSet(el, value) {
    const ni = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
    const nt = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
    try { if (el.tagName==='TEXTAREA'&&nt) nt.call(el,value); else if(ni) ni.call(el,value); else el.value=value; }
    catch(_) { el.value = value; }
    ['input','change','blur'].forEach(ev => el.dispatchEvent(new Event(ev, {bubbles:true})));
  }

  let filled = 0;
  const containers = document.querySelectorAll('[role="listitem"], .freebirdFormviewerViewItemsItemItem, .freebirdFormviewerComponentsQuestionBaseRoot');

  containers.forEach(q => {
    const labelEl = q.querySelector('[role="heading"], .M7eMe, .z12JJ, .freebirdFormviewerComponentsQuestionBaseTitle, .exportLabel');
    if (!labelEl) return;
    const val = findVal(labelEl.innerText || labelEl.textContent || '');
    if (!val) return;
    const valStr = String(val);

    const textEl = q.querySelector('input[type="text"],input[type="email"],input[type="tel"],input[type="url"],input[type="number"],input[type="date"],textarea');
    if (textEl) { reactSet(textEl, valStr); filled++; return; }

    const radios = q.querySelectorAll('[role="radio"]');
    if (radios.length) {
      const nv = norm(valStr); let matched = false;
      // Try exact/partial match first
      radios.forEach(r => {
        const rt = norm(r.getAttribute('data-value') || r.querySelector('span')?.innerText || '');
        if (!matched && (rt===nv||nv.includes(rt)||rt.includes(nv))) { r.click(); matched=true; filled++; }
      });
      // If not matched, try "Other" option and fill nearby text input
      if (!matched) {
        radios.forEach(r => {
          const rt = norm(r.getAttribute('data-value') || r.querySelector('span')?.innerText || '');
          if (!matched && rt === 'other') {
            r.click(); matched=true; filled++;
            setTimeout(() => {
              const otherInput = q.querySelector('input[type="text"]');
              if (otherInput) reactSet(otherInput, valStr);
            }, 200);
          }
        });
      }
      if (matched) return;
    }

    const checks = q.querySelectorAll('[role="checkbox"]');
    if (checks.length) {
      const vals = valStr.split(',').map(x => norm(x.trim()));
      checks.forEach(c => {
        const ct = norm(c.getAttribute('data-value') || c.querySelector('span')?.innerText || '');
        if (vals.some(v => ct.includes(v)||v.includes(ct)) && c.getAttribute('aria-checked')!=='true') { c.click(); filled++; }
      });
      return;
    }

    const sel = q.querySelector('select');
    if (sel) {
      const nv = norm(valStr); let matched = false;
      for (let i=0;i<sel.options.length;i++) {
        const on = norm(sel.options[i].text);
        if (on===nv||nv.includes(on)||on.includes(nv)) {
          sel.selectedIndex=i; sel.dispatchEvent(new Event('change',{bubbles:true})); filled++; matched=true; break;
        }
      }
      // If not matched, try selecting "Other" and fill nearby text input
      if (!matched) {
        for (let i=0;i<sel.options.length;i++) {
          if (norm(sel.options[i].text)==='other') {
            sel.selectedIndex=i; sel.dispatchEvent(new Event('change',{bubbles:true})); filled++;
            setTimeout(() => {
              const otherInput = q.querySelector('input[type="text"]');
              if (otherInput) reactSet(otherInput, valStr);
            }, 200);
            break;
          }
        }
      }
    }
  });

  return filled;
}

// ═══════════════════════════════════════════════════════════
// AUTO SAVE
// ═══════════════════════════════════════════════════════════
let autoSaveTimer = null;

function triggerAutoSave() {
  clearTimeout(autoSaveTimer);
  autoSaveTimer = setTimeout(() => {
    const profile = buildProfile();
    if (!profile.firstName && !profile.email) return; // don't save empty
    chrome.storage.local.set({ tnpProfile: profile }, () => {
      showAutoSaveBadge();
      refreshFillPanel();
    });
  }, 800); // 800ms after last keystroke
}

function showAutoSaveBadge() {
  let badge = $('autosave-badge');
  if (!badge) return;
  badge.textContent = 'Saved';
  badge.classList.add('show');
  clearTimeout(badge._hideTimer);
  badge._hideTimer = setTimeout(() => badge.classList.remove('show'), 2000);
}

function initAutoSave() {
  const profilePanel = $('panel-profile');
  if (!profilePanel) return;

  // Listen to all text inputs and textareas in profile panel
  profilePanel.querySelectorAll('input, textarea, select').forEach(el => {
    el.addEventListener('input', triggerAutoSave);
    el.addEventListener('change', triggerAutoSave);
  });

  // Also hook into toggle chips, rating chips, YN clicks — they fire triggerAutoSave via a custom event
  // We patch the toggle/rating/yn init to call triggerAutoSave after state change
}

// Patch: call triggerAutoSave after any toggle/rating/yn change
function patchToggleAutoSave() {
  document.querySelectorAll('#panel-profile .tc, #panel-profile .rc, #yn_yes, #yn_no').forEach(el => {
    el.addEventListener('click', () => setTimeout(triggerAutoSave, 50));
  });
}

// ═══════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initToggles();
  initRatings();
  initYN();
  initSkills();
  initBuilder();
  initCollegeSearch();
  initAutoSave();
  patchToggleAutoSave();
  renderCustomList();

  // Wire save profile button
  const saveBtn = $('saveProfileBtn');
  if (saveBtn) saveBtn.addEventListener('click', saveProfile);

  // Wire fill button
  const fillBtn = $('fillBtn');
  if (fillBtn) fillBtn.addEventListener('click', triggerFill);

  // Load saved data
  chrome.storage.local.get(['tnpProfile','tnpCustomFields'], r => {
    if (r.tnpProfile)      loadProfileIntoForm(r.tnpProfile);
    if (r.tnpCustomFields && r.tnpCustomFields.length) {
      customFields = r.tnpCustomFields;
      renderCustomList();
    }
  });

  refreshFillPanel();
});

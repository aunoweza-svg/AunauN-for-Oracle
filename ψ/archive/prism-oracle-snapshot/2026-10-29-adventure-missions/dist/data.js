const PLACES = [
  {
    "id": "1-2",
    "name": "โรงแรมภูกลอง",
    "type": "ที่พัก",
    "area": "เมือง",
    "url": "https://maps.app.goo.gl/q21yyXjRijoTjKyt5",
    "phone": "054-481-915",
    "lat": null,
    "lon": null
  },
  {
    "id": "1-3",
    "name": "โรงแรมเอบิช สาขากว๊านพะเยา Abizz Kwanphayao",
    "type": "ที่พัก",
    "area": "เมือง",
    "url": "https://maps.app.goo.gl/2ATKutam5WbisY4HA",
    "phone": "054-431-959, 054-431-995",
    "lat": null,
    "lon": null
  },
  {
    "id": "1-4",
    "name": "นาคาธารา รีสอร์ท",
    "type": "ที่พัก",
    "area": "เมือง",
    "url": "https://maps.app.goo.gl/2BAnnMMzBiLguZd86",
    "phone": "054-430-838",
    "lat": null,
    "lon": null
  },
  {
    "id": "1-5",
    "name": "โรงแรมเคเอ็มกว๊านพะเยา KM Kwanphayao Hotel",
    "type": "ที่พัก",
    "area": "เมือง",
    "url": "https://maps.app.goo.gl/rLYJMt2pznKMF21u9",
    "phone": "054-071-243",
    "lat": null,
    "lon": null
  },
  {
    "id": "1-6",
    "name": "Dee Hotel Phayao",
    "type": "ที่พัก",
    "area": "เมือง",
    "url": "https://maps.app.goo.gl/Fy4nCJ9q1D6SEP7x6",
    "phone": "062-951-9199",
    "lat": null,
    "lon": null
  },
  {
    "id": "1-7",
    "name": "M2 Hotel Phayao",
    "type": "ที่พัก",
    "area": "เมือง",
    "url": "https://maps.app.goo.gl/BWNMg2XzXnaXM3Mw6",
    "phone": "054-480-962",
    "lat": null,
    "lon": null
  },
  {
    "id": "1-8",
    "name": "M2 Hotel Waterside",
    "type": "ที่พัก",
    "area": "เมือง",
    "url": "https://maps.app.goo.gl/GoCWYJqBv4cN3vci6",
    "phone": "054-070-587",
    "lat": null,
    "lon": null
  },
  {
    "id": "1-9",
    "name": "โรงแรมออโรร่าเฮ้าส์",
    "type": "ที่พัก",
    "area": "เมือง",
    "url": "https://maps.app.goo.gl/3NGJnAyZy5fyy3pN9",
    "phone": "054-410-065",
    "lat": null,
    "lon": null
  },
  {
    "id": "1-10",
    "name": "โรงแรมพะเยาเกทเวย์",
    "type": "ที่พัก",
    "area": "เมือง",
    "url": "https://maps.app.goo.gl/muvTgjARnq1M4r1YA",
    "phone": "054-484-333",
    "lat": null,
    "lon": null
  },
  {
    "id": "1-11",
    "name": "โรงแรมพิลโล่อินน์พะเยา Pillowinn Phayao",
    "type": "ที่พัก",
    "area": "เมือง",
    "url": "https://maps.app.goo.gl/Ajv7rhkLgivqpLbw9",
    "phone": "063-805-7186",
    "lat": null,
    "lon": null
  },
  {
    "id": "1-12",
    "name": "โรงแรมเดอะโคซีเนสท์",
    "type": "ที่พัก",
    "area": "เมือง",
    "url": "https://maps.app.goo.gl/ZXDaMZUAjAhjDu4t6",
    "phone": "054-071-222",
    "lat": null,
    "lon": null
  },
  {
    "id": "1-13",
    "name": "โรงแรมชายกว๊าน",
    "type": "ที่พัก",
    "area": "เมือง",
    "url": "https://maps.app.goo.gl/zXACfiMEShQU3PMd9",
    "phone": "054-073-991",
    "lat": null,
    "lon": null
  },
  {
    "id": "1-17",
    "name": "ครัวออโรร่า",
    "type": "ร้านอาหาร",
    "area": "เมือง",
    "url": "https://maps.app.goo.gl/ecUhirR1XKRrzypf6",
    "phone": "054-410-065",
    "lat": null,
    "lon": null
  },
  {
    "id": "1-18",
    "name": "ก๋วยเตี๋ยวเฮียน้อยอันเจริญ 168",
    "type": "ร้านอาหาร",
    "area": "เมือง",
    "url": "https://maps.app.goo.gl/qUjg5yueae9Ws47w5",
    "phone": "092-656-5646",
    "lat": null,
    "lon": null
  },
  {
    "id": "1-19",
    "name": "ร้านอาหารดีเดย์ D-Day",
    "type": "ร้านอาหาร",
    "area": "เมือง",
    "url": "https://maps.app.goo.gl/PnFMnd5JJetfiMTd9",
    "phone": "054-481-443",
    "lat": null,
    "lon": null
  },
  {
    "id": "1-20",
    "name": "ร้านอาหารจันทร์ทิพย์",
    "type": "ร้านอาหาร",
    "area": "เมือง",
    "url": "https://maps.app.goo.gl/vpt5cBwJmJ5aR2W4A",
    "phone": "084-808-8601",
    "lat": null,
    "lon": null
  },
  {
    "id": "1-21",
    "name": "สุขแต๊",
    "type": "ร้านอาหาร",
    "area": "เมือง",
    "url": "https://maps.app.goo.gl/xeAPxX7UmjxnwBma9",
    "phone": "088-565-6936",
    "lat": null,
    "lon": null
  },
  {
    "id": "1-22",
    "name": "ไมอามี่พะเยา",
    "type": "ร้านอาหาร",
    "area": "เมือง",
    "url": "https://maps.app.goo.gl/oHJn4SfR5GenEvtAA",
    "phone": "094-928-0297",
    "lat": null,
    "lon": null
  },
  {
    "id": "1-23",
    "name": "เฮียอู๊ดข้าวต้มโต้รุ่ง",
    "type": "ร้านอาหาร",
    "area": "เมือง",
    "url": "https://maps.app.goo.gl/vPMnzLD4wmLxXGSY8",
    "phone": "054-480-841",
    "lat": null,
    "lon": null
  },
  {
    "id": "1-24",
    "name": "นิยมสุข×Feeling Follow",
    "type": "ร้านอาหาร",
    "area": "เมือง",
    "url": "https://maps.app.goo.gl/ojF7kk8pKqG4zoAS7",
    "phone": "094-616-9396",
    "lat": null,
    "lon": null
  },
  {
    "id": "1-25",
    "name": "ครัวเข้าท่า",
    "type": "ร้านอาหาร",
    "area": "เมือง",
    "url": "https://maps.app.goo.gl/z5gTAtLcg7e7tbpM7",
    "phone": "084-150-7530",
    "lat": null,
    "lon": null
  },
  {
    "id": "1-26",
    "name": "แนบเนื้อพะเยา",
    "type": "ร้านอาหาร",
    "area": "เมือง",
    "url": "https://maps.app.goo.gl/Du5HX8x42P5KzCiGA",
    "phone": "095-676-8725",
    "lat": null,
    "lon": null
  },
  {
    "id": "1-27",
    "name": "ลาบโกฎา",
    "type": "ร้านอาหาร",
    "area": "เมือง",
    "url": "https://maps.app.goo.gl/G8W1uXMa7j153C5m9",
    "phone": "082-919-6798",
    "lat": null,
    "lon": null
  },
  {
    "id": "1-28",
    "name": "ตี้ฝางหมาล่าทั่ง พะเยา",
    "type": "ร้านอาหาร",
    "area": "เมือง",
    "url": "https://maps.app.goo.gl/yntUhRi5RgmPo6Xx7",
    "phone": "095-676-8725",
    "lat": null,
    "lon": null
  },
  {
    "id": "1-29",
    "name": "ฮิปสเตอร์สเต๊ก พะเยา",
    "type": "ร้านอาหาร",
    "area": "เมือง",
    "url": "https://maps.app.goo.gl/FbA2DfQKDYyP3GU29",
    "phone": "091-045-1300",
    "lat": null,
    "lon": null
  },
  {
    "id": "1-30",
    "name": "SUSHI DAI",
    "type": "ร้านอาหาร",
    "area": "เมือง",
    "url": "https://maps.app.goo.gl/t86ocwESadBCxo3cA",
    "phone": "093-150-5001",
    "lat": null,
    "lon": null
  },
  {
    "id": "1-31",
    "name": "Jen-Ko House Cafe&Bar",
    "type": "ร้านอาหาร",
    "area": "เมือง",
    "url": "https://maps.app.goo.gl/2SWHpYP1AL8ErgQF7",
    "phone": "095-623-2450",
    "lat": null,
    "lon": null
  },
  {
    "id": "1-32",
    "name": "BANN NAI WIANG บ้านในเวียง",
    "type": "ร้านอาหาร",
    "area": "เมือง",
    "url": "https://maps.app.goo.gl/s1SpPLtg2CN1acYj6",
    "phone": "088-318-9669",
    "lat": null,
    "lon": null
  },
  {
    "id": "1-33",
    "name": "ไอวากว๊านพะเยา",
    "type": "ร้านอาหาร",
    "area": "เมือง",
    "url": "https://maps.app.goo.gl/F8rd2Yvw7SxdrHFq6",
    "phone": "082-896-5966",
    "lat": null,
    "lon": null
  },
  {
    "id": "1-34",
    "name": "เขียงไห้",
    "type": "ร้านอาหาร",
    "area": "เมือง",
    "url": "https://maps.app.goo.gl/n3z3mxGcqnviNcnx9",
    "phone": "096-235-5265",
    "lat": null,
    "lon": null
  },
  {
    "id": "1-38",
    "name": "PREMMCAFE เปรมคาเฟ่",
    "type": "คาเฟ่",
    "area": "เมือง",
    "url": "https://maps.app.goo.gl/b9pDaASyMFFscZ5BA",
    "phone": "088-318-9669",
    "lat": null,
    "lon": null
  },
  {
    "id": "1-39",
    "name": "SEE U AGAIN",
    "type": "คาเฟ่",
    "area": "เมือง",
    "url": "https://maps.app.goo.gl/4U9s65VGhAabZpGc9",
    "phone": "093-150-5001",
    "lat": null,
    "lon": null
  },
  {
    "id": "1-40",
    "name": "baanbaann",
    "type": "คาเฟ่",
    "area": "เมือง",
    "url": "https://maps.app.goo.gl/tXphKG5B35ZZ7Jet8",
    "phone": "087-798-0987",
    "lat": null,
    "lon": null
  },
  {
    "id": "1-41",
    "name": "ร้านกาแฟท่าเรือ Coffee & OTOP ท่าเรือวัดติโลกอาราม",
    "type": "คาเฟ่",
    "area": "เมือง",
    "url": "https://maps.app.goo.gl/AQzucJH3FPCwfCvA6",
    "phone": "083-464-6564",
    "lat": null,
    "lon": null
  },
  {
    "id": "1-42",
    "name": "LAKELAND CAFE",
    "type": "คาเฟ่",
    "area": "เมือง",
    "url": "https://maps.app.goo.gl/rofCAVp2X64EnPpt7",
    "phone": "082-623-7264",
    "lat": null,
    "lon": null
  },
  {
    "id": "1-43",
    "name": "นิทานบ้านต้นไม้",
    "type": "คาเฟ่",
    "area": "เมือง",
    "url": "https://maps.app.goo.gl/FQvsXP7MRMuTEQGYA?g_st=ac",
    "phone": "086-924-2989",
    "lat": null,
    "lon": null
  },
  {
    "id": "1-44",
    "name": "หลังสวน Coffee House",
    "type": "คาเฟ่",
    "area": "เมือง",
    "url": "https://maps.app.goo.gl/275KoiTMiip91Zyx7",
    "phone": "0647591651, 0932823965",
    "lat": null,
    "lon": null
  },
  {
    "id": "1-45",
    "name": "อะกาลิโกอิงกว๊าน",
    "type": "คาเฟ่",
    "area": "เมือง",
    "url": "https://maps.app.goo.gl/GCFNHUc64B18AiXd8",
    "phone": "062-149-5564",
    "lat": null,
    "lon": null
  },
  {
    "id": "1-46",
    "name": "โรงคั่วกาแฟพะเยา",
    "type": "คาเฟ่",
    "area": "เมือง",
    "url": "https://maps.app.goo.gl/dZ38V1cM9FuVC1JUA",
    "phone": "094-615-7111",
    "lat": null,
    "lon": null
  },
  {
    "id": "1-47",
    "name": "White Cottage",
    "type": "คาเฟ่",
    "area": "เมือง",
    "url": "https://maps.app.goo.gl/LQ2eirSF2TavPST77",
    "phone": "062-782-4696",
    "lat": null,
    "lon": null
  },
  {
    "id": "1-48",
    "name": "บ้านผักตบชวา ผ้าไทย",
    "type": "ของที่ระลึก",
    "area": "เมือง",
    "url": "https://maps.app.goo.gl/E6HGHPGav4XWnKBK6",
    "phone": "086-196-0977",
    "lat": null,
    "lon": null
  },
  {
    "id": "2-2",
    "name": "โรงแรมเดอวันดี",
    "type": "ที่พัก",
    "area": "เชียงคำ",
    "url": "https://maps.app.goo.gl/c3m2hQwfWpv1MUJ78",
    "phone": "062 614 4964",
    "lat": null,
    "lon": null
  },
  {
    "id": "2-3",
    "name": "โรงแรมแมลงปอฮอลแอนด์การ์เด้น",
    "type": "ที่พัก",
    "area": "เชียงคำ",
    "url": "https://maps.app.goo.gl/tuPMzVBLDD9puZsG7",
    "phone": "063 231 1145",
    "lat": null,
    "lon": null
  },
  {
    "id": "2-4",
    "name": "โรงแรมเชียงคำแกรนด์ วิลล่า",
    "type": "ที่พัก",
    "area": "เชียงคำ",
    "url": "https://maps.app.goo.gl/A9kZvafsVgQjQRcV8",
    "phone": "084 811 5585",
    "lat": null,
    "lon": null
  },
  {
    "id": "2-5",
    "name": "เชียงคำไทลื้อรีสอร์ท",
    "type": "ที่พัก",
    "area": "เชียงคำ",
    "url": "https://maps.app.goo.gl/rgVtoV5bTtniTBq79",
    "phone": "080-846-1900 / 054-451-032",
    "lat": null,
    "lon": null
  },
  {
    "id": "2-6",
    "name": "ช่อม่วงการ์เด้นท์โฮม",
    "type": "ที่พัก",
    "area": "เชียงคำ",
    "url": "https://maps.app.goo.gl/rgVtoV5bTtniTBq79",
    "phone": "089-950-3514",
    "lat": null,
    "lon": null
  },
  {
    "id": "2-10",
    "name": "ตี้ฝางหมาล่าทั่ง เชียงคำ",
    "type": "ร้านอาหาร",
    "area": "เชียงคำ",
    "url": "https://maps.app.goo.gl/oAjMg6K1Hcn1PyWN7",
    "phone": "093-823-3458",
    "lat": null,
    "lon": null
  },
  {
    "id": "2-11",
    "name": "ร้านผัดไทยหมื่นลี้",
    "type": "ร้านอาหาร",
    "area": "เชียงคำ",
    "url": "https://maps.app.goo.gl/1NEFA1QaVurVzqc47",
    "phone": "0985804214",
    "lat": null,
    "lon": null
  },
  {
    "id": "2-12",
    "name": "ร้านอาหารบ้านเพื่อนฮิมลาว",
    "type": "ร้านอาหาร",
    "area": "เชียงคำ",
    "url": "https://maps.app.goo.gl/YwDSX4uGa28W8DeG7",
    "phone": "095-679-6669",
    "lat": null,
    "lon": null
  },
  {
    "id": "2-13",
    "name": "ร้านขนมจีนบ้านคุณยาย-ร้านสรวลน้ำปั่น",
    "type": "ร้านอาหาร",
    "area": "เชียงคำ",
    "url": "https://maps.app.goo.gl/8VcNvgcXz9PLbFVH6",
    "phone": "081 724 1319/088 417 8268",
    "lat": null,
    "lon": null
  },
  {
    "id": "2-14",
    "name": "สุดยอดก๋วยเตี๋ยวเนื้อป้ากาบ",
    "type": "ร้านอาหาร",
    "area": "เชียงคำ",
    "url": "https://maps.app.goo.gl/DDZcCNjeureNfJAF7",
    "phone": "084-460-5991/054-451-287",
    "lat": null,
    "lon": null
  },
  {
    "id": "2-15",
    "name": "ร้านลาบโมโยลื้อ",
    "type": "ร้านอาหาร",
    "area": "เชียงคำ",
    "url": "https://maps.app.goo.gl/gQYQLHY1uywvJkAB9?g_st=ac",
    "phone": "084-948-4599",
    "lat": null,
    "lon": null
  },
  {
    "id": "2-16",
    "name": "ร้านยำปูม้าเจ็ดยอด สาขาเชียงคำ",
    "type": "ร้านอาหาร",
    "area": "เชียงคำ",
    "url": "https://maps.app.goo.gl/kv6urqgaPCArgdK28",
    "phone": "091 875 9179",
    "lat": null,
    "lon": null
  },
  {
    "id": "2-20",
    "name": "mar.coffee&homemade bakery",
    "type": "คาเฟ่",
    "area": "เชียงคำ",
    "url": "https://maps.app.goo.gl/sEZAxLiLC7XrSzLn6?g_st=ac",
    "phone": "061 361 3462",
    "lat": null,
    "lon": null
  },
  {
    "id": "2-21",
    "name": "ใจสบายคาเฟ่",
    "type": "คาเฟ่",
    "area": "เชียงคำ",
    "url": "https://maps.app.goo.gl/VSke7CfGv7UiLxSe9",
    "phone": "091 868 6536",
    "lat": null,
    "lon": null
  },
  {
    "id": "2-22",
    "name": "The corner (เดอะ คอเนอร์)",
    "type": "คาเฟ่",
    "area": "เชียงคำ",
    "url": "https://maps.app.goo.gl/KNGX2ncouiUFRZFW6",
    "phone": "082 645 5146",
    "lat": null,
    "lon": null
  },
  {
    "id": "2-23",
    "name": "สุขดี specialty coffee",
    "type": "คาเฟ่",
    "area": "เชียงคำ",
    "url": "https://maps.app.goo.gl/Ngk1bPEgogDzcTUH8",
    "phone": "098 330 8556",
    "lat": null,
    "lon": null
  },
  {
    "id": "2-24",
    "name": "ร้านกาแฟหอมจำปาสโลว์บาร์",
    "type": "คาเฟ่",
    "area": "เชียงคำ",
    "url": "https://maps.app.goo.gl/2M2oF2jt4au2hMnK7",
    "phone": "084 047 3713",
    "lat": null,
    "lon": null
  },
  {
    "id": "2-25",
    "name": "On Retro",
    "type": "คาเฟ่",
    "area": "เชียงคำ",
    "url": "https://maps.app.goo.gl/nWX3KSiBegdQ5hev5?g_st=ac",
    "phone": "097 260 4915",
    "lat": null,
    "lon": null
  },
  {
    "id": "2-26",
    "name": "ฮุโนะ คาเฟ่ (ฮอมเมิน คาเฟ่)",
    "type": "คาเฟ่",
    "area": "เชียงคำ",
    "url": "https://maps.app.goo.gl/dMXg2QfjTKMBNtGWA",
    "phone": "082-923-9234",
    "lat": null,
    "lon": null
  },
  {
    "id": "2-27",
    "name": "อ้ายเก๊าหมี่กรอบลำไย",
    "type": "ของที่ระลึก",
    "area": "เชียงคำ",
    "url": "https://maps.app.goo.gl/VrMjTxSXzj9LFz4YA?g_st=ac",
    "phone": "093 169 4645",
    "lat": null,
    "lon": null
  },
  {
    "id": "2-28",
    "name": "ศูนย์วัฒนธรรมไทลื้อวัดหย่วน",
    "type": "ของที่ระลึก",
    "area": "เชียงคำ",
    "url": "https://maps.app.goo.gl/HeRPrqxMsd3JYxGCA?g_st=ac",
    "phone": "087-182-6731",
    "lat": null,
    "lon": null
  }
];

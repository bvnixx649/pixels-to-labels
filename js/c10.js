/* Chapter 10: Classification & Detection (training, models, metrics) */
window.LESSONS = (window.LESSONS || []).concat([

/* ------------------------------------------------------------------ */
{
id: 'tasks', ch: 10,
title: 'Computer Vision Tasks',
sub: 'AI ต่างจากการประมวลผลภาพที่คนเลือกวิธีเองอย่างไร งาน computer vision มีกี่แบบ และกว่าจะได้โมเดลไปใช้จริงต้องผ่านอะไร',
desc: 'AI vs วิธีที่คนเลือก, ANI/AGI/ASI, 4 ประเภทงาน CV, classification vs detection, ML lifecycle',
body: `
<h2>AI ต่างจากการประมวลผลภาพแบบเดิมอย่างไร</h2>
<p>ทั้งสองแบบรับภาพเข้าไปเพื่อบรรลุจุดประสงค์บางอย่างเหมือนกัน ต่างกันที่<strong>ใครเป็นคนหาวิธี</strong></p>
<ul>
<li><strong>วิธีประมวลผลภาพที่คนเลือก</strong> คนทดลองและเลือกวิธีที่ดีที่สุดเอง เช่น เลือก filter, threshold, morphology ทีละขั้น (สิ่งที่ทำใน lab 1 ถึง 6)</li>
<li><strong>โมเดล AI</strong> โมเดลเรียนรู้วิธีเองจากตัวอย่างที่มีเฉลย คนเตรียมข้อมูลแล้ว “นอนรอผล”</li>
</ul>
<p>AI แบ่งตามความสามารถได้ 3 ระดับ: <strong>ANI</strong> (Artificial Narrow Intelligence) เก่งเฉพาะด้านเดียว เช่น Siri, Alexa, Cortana, <strong>AGI</strong> (General) ฉลาดเท่ามนุษย์ในทุกด้าน และ <strong>ASI</strong> (Super) ฉลาดกว่ามนุษย์ที่เก่งที่สุดในเกือบทุกด้าน โมเดลจำแนกหมาแมวที่เราเทรนเป็น ANI</p>

<h2>4 ประเภทของงาน Computer Vision</h2>
<div class="fig" data-fig="tasks"></div>
<div class="tbl-wrap"><table class="tbl">
<tr><th>งาน</th><th>ตอบคำถาม</th><th>Output</th></tr>
<tr><td>Classification</td><td>ภาพนี้คืออะไร (วัตถุเดียว)</td><td>1 label + confidence</td></tr>
<tr><td>Classification + Localization</td><td>คืออะไร อยู่ตรงไหน (วัตถุเดียว)</td><td>1 label + 1 กรอบ</td></tr>
<tr><td>Object Detection</td><td>มีอะไรบ้าง อยู่ตรงไหนบ้าง (หลายวัตถุ)</td><td>หลาย label + กรอบ (bounding box) + confidence</td></tr>
<tr><td>Instance Segmentation</td><td>วัตถุแต่ละชิ้นครอบคลุมพิกเซลไหน</td><td>หน้ากาก (mask) ตามรูปทรงจริงของแต่ละชิ้น</td></tr>
</table></div>

<h2>Classification กับ Detection</h2>
<div class="tbl-wrap"><table class="tbl">
<tr><th></th><th>Classification</th><th>Object Detection</th></tr>
<tr><td>คำถาม</td><td>ภาพนี้คืออะไร</td><td>มีอะไร อยู่ตรงไหน</td></tr>
<tr><td>Label ที่ต้องเตรียม</td><td>ชื่อคลาสต่อภาพ ใส่ภาพลงโฟลเดอร์ตามคลาส (เร็วมาก)</td><td>ลากกรอบทุกวัตถุในทุกภาพ (ช้ากว่า 5 ถึง 10 เท่า)</td></tr>
<tr><td>Metric หลัก</td><td>Accuracy, Precision, Recall, F1</td><td>Precision, Recall, F1, IoU, mAP@50</td></tr>
<tr><td>ข้อมูลที่ต้องใช้</td><td>น้อยกว่า</td><td>มากกว่ามาก</td></tr>
<tr><td>ใช้เมื่อ</td><td>ทั้งภาพมีของอย่างเดียว</td><td>มีหลายวัตถุ ต้องรู้ตำแหน่ง หรือต้องนับจำนวน</td></tr>
</table></div>
<p>กฎง่าย ๆ: ถ้า classification ตอบโจทย์ได้ ไม่ควรใช้ detection เพราะแพงกว่าทั้งเวลาทำ label และเวลาเทรน ตัวอย่างงานจริง: classification ใช้วินิจฉัยโรคพืชหรือภาพแพทย์ทั้งภาพ ส่วน detection ใช้หาและระบุซี่ฟันในภาพ X-ray ฟัน หรือนับวัตถุ</p>

<h2>กว่าจะได้โมเดลไปใช้งานจริง</h2>
<div class="fig" data-fig="lifecycle"></div>
<p>ML project lifecycle มี 4 ช่วง: <strong>Scoping</strong> กำหนดโจทย์, <strong>Data</strong> กำหนดข้อมูลและ baseline แล้วติดป้ายและจัดระเบียบข้อมูล, <strong>Modeling</strong> เลือกและเทรนโมเดลแล้ววิเคราะห์ข้อผิดพลาด, <strong>Deployment</strong> นำไปใช้จริงแล้วติดตามดูแลระบบ ทุกช่วงย้อนกลับได้ เช่น วิเคราะห์ error แล้วพบว่าต้องกลับไปเก็บข้อมูลเพิ่ม ในคาบนี้เน้นช่วง Data (เตรียม dataset ใน Roboflow) และ Modeling (เทรนและวัดผล)</p>
`,
written: [
{ q: 'การใช้โมเดล AI ในการประมวลผลภาพ ต่างจากวิธีประมวลผลภาพแบบดั้งเดิมที่คนเลือกวิธีเองอย่างไร', a: `
<p>ทั้งสองแบบรับภาพเพื่อบรรลุจุดประสงค์บางอย่าง ต่างกันที่วิธีได้มาของขั้นตอนการประมวลผล</p>
<ul><li><strong>แบบดั้งเดิม</strong> คนต้องทดลองและเลือกวิธีที่ดีที่สุดเอง เช่น เลือก filter, threshold, edge detector ต้องอาศัยความรู้และการลองผิดลองถูก เหมาะกับปัญหาที่เงื่อนไขชัดเจน</li>
<li><strong>โมเดล AI</strong> โมเดลเรียนรู้วิธีเองจากข้อมูลตัวอย่างที่มีคำตอบ คนทำหน้าที่เตรียมข้อมูลและตั้งค่า แล้วรอผลการเทรน รองรับปัญหาที่ซับซ้อนและหลากหลายได้ดีกว่า แต่ต้องใช้ข้อมูลและพลังประมวลผลมาก</li></ul>` },
{ q: 'จงอธิบายประเภทของงาน Computer Vision ทั้ง 4 แบบ พร้อมบอก output ของแต่ละแบบ', a: `
<ol><li><strong>Classification</strong> บอกว่าภาพทั้งภาพคืออะไร output เป็น label 1 ค่า เช่น CAT</li>
<li><strong>Classification + Localization</strong> บอกว่าวัตถุ (หนึ่งชิ้น) คืออะไรและอยู่ตรงไหน output เป็น label + bounding box 1 กรอบ</li>
<li><strong>Object Detection</strong> หาวัตถุหลายชิ้นในภาพ output เป็น label + bounding box + confidence ของแต่ละชิ้น เช่น CAT, DOG, DUCK</li>
<li><strong>Instance Segmentation</strong> แยกวัตถุแต่ละชิ้นในระดับพิกเซล output เป็น mask ตามรูปทรงจริงของแต่ละชิ้น</li></ol>
<p>สองแบบแรกใช้กับวัตถุเดียว สองแบบหลังใช้กับหลายวัตถุ</p>` },
{ q: 'จงเปรียบเทียบ Image Classification กับ Object Detection ในด้านคำถามที่ตอบ output การเตรียม label และการวัดผล', tag: 'เปรียบเทียบ', a: `
<ul><li><strong>คำถาม</strong> classification ตอบว่า “ภาพนี้คืออะไร” detection ตอบว่า “มีอะไร อยู่ตรงไหน”</li>
<li><strong>Output</strong> classification ได้ 1 label + confidence ต่อภาพ detection ได้หลาย label + bounding box + confidence</li>
<li><strong>Label</strong> classification แค่ระบุคลาสของภาพ (เช่น เก็บในโฟลเดอร์ชื่อคลาส) detection ต้องวาดกรอบทุกวัตถุ ใช้เวลามากกว่าหลายเท่า</li>
<li><strong>การวัดผล</strong> classification ใช้ accuracy, precision, recall, F1 detection ต้องดูทั้งชื่อและตำแหน่ง จึงใช้ IoU ร่วมกับ precision, recall และ mAP</li>
<li><strong>ข้อมูล</strong> detection ต้องการข้อมูลมากกว่า</li></ul>` },
{ q: 'จงอธิบาย ML project lifecycle ทั้ง 4 ช่วง', a: `
<ol><li><strong>Scoping</strong> กำหนดโจทย์และขอบเขตของโปรเจกต์ (define project)</li>
<li><strong>Data</strong> กำหนดข้อมูลที่ต้องใช้และตั้ง baseline จากนั้นติดป้าย (label) และจัดระเบียบข้อมูล</li>
<li><strong>Modeling</strong> เลือกและเทรนโมเดล แล้ววิเคราะห์ข้อผิดพลาด (error analysis)</li>
<li><strong>Deployment</strong> นำโมเดลไปใช้งานจริง และติดตามดูแลระบบ (monitor & maintain)</li></ol>
<p>กระบวนการวนกลับได้ เช่น ผลวิเคราะห์ error ชี้ว่าต้องเก็บหรือแก้ข้อมูลเพิ่ม ก็กลับไปช่วง Data</p>` },
{ q: 'AI แบ่งตามระดับความสามารถได้กี่ประเภท อะไรบ้าง โมเดลจำแนกภาพที่เทรนในคาบอยู่ประเภทใด', a: `
<ul><li><strong>ANI (Artificial Narrow Intelligence)</strong> เก่งเฉพาะด้านเดียว แก้ปัญหาเดียว เช่น Siri, Alexa, Cortana</li>
<li><strong>AGI (Artificial General Intelligence)</strong> ฉลาดเท่ามนุษย์ในทุกด้าน</li>
<li><strong>ASI (Artificial Super Intelligence)</strong> ฉลาดกว่ามนุษย์ที่เก่งที่สุดในแทบทุกด้าน</li></ul>
<p>โมเดลจำแนกหมาแมวหรือตรวจจับวัตถุที่เทรนในคาบเป็น ANI เพราะทำได้เฉพาะงานที่ถูกเทรนมา</p>` },
{ q: 'ถ้าโจทย์คือ (ก) ตรวจว่าใบพืชเป็นโรคหรือไม่ (ข) นับจำนวนรถในลานจอด (ค) วัดพื้นที่ของเนื้องอกในภาพ MRI ควรใช้งาน computer vision แบบใด เพราะอะไร', tag: 'คิดวิเคราะห์', a: `
<ul><li><strong>(ก) Classification</strong> ภาพหนึ่งภาพมีใบเดียว ต้องการแค่คำตอบว่าเป็นโรคหรือไม่ เตรียม label ง่ายและใช้ข้อมูลน้อยกว่า</li>
<li><strong>(ข) Object detection</strong> มีรถหลายคันในภาพเดียว ต้องหาตำแหน่งของแต่ละคันจึงนับได้</li>
<li><strong>(ค) Instance segmentation</strong> ต้องการรูปทรงจริงระดับพิกเซลเพื่อวัดพื้นที่ กรอบสี่เหลี่ยมจะรวมพื้นที่ที่ไม่ใช่เนื้องอกด้วย</li></ul>` },
],
mcq: [
{ q: 'งานที่ output เป็น label + bounding box ของวัตถุหลายชิ้นคือ', o: ['Classification', 'Classification + Localization', 'Object Detection', 'Instance Segmentation'], a: 2, why: 'Detection หาหลายวัตถุพร้อมกรอบ ส่วน localization ใช้กับวัตถุเดียว' },
{ q: 'งานที่แยกวัตถุแต่ละชิ้นตามรูปทรงจริงระดับพิกเซลคือ', o: ['Object Detection', 'Instance Segmentation', 'Classification', 'Localization'], a: 1, why: 'Instance segmentation ให้ mask ของแต่ละชิ้น' },
{ q: 'Siri และ Alexa จัดเป็น AI ประเภทใด', o: ['ANI', 'AGI', 'ASI', 'ไม่ใช่ AI'], a: 0, why: 'ANI เก่งเฉพาะด้าน แก้ปัญหาในขอบเขตเดียว' },
{ q: 'ช่วง “Label and organize data” อยู่ใน lifecycle ส่วนใด', o: ['Scoping', 'Data', 'Modeling', 'Deployment'], a: 1, why: 'ช่วง Data มี define data & establish baseline และ label & organize data' },
{ q: '“Perform error analysis” อยู่ในช่วงใด', o: ['Scoping', 'Data', 'Modeling', 'Deployment'], a: 2, why: 'Modeling ประกอบด้วย select & train model และ perform error analysis' },
{ q: 'ข้อใดเป็นข้อเสียของ object detection เทียบกับ classification', o: ['บอกตำแหน่งไม่ได้', 'ต้องวาดกรอบทุกวัตถุ ใช้เวลาเตรียม label มากกว่า', 'ใช้ข้อมูลน้อยกว่า', 'ใช้ accuracy วัดผลไม่ได้เลยทุกกรณี'], a: 1, why: 'Detection ต้องลากกรอบทุกวัตถุในทุกภาพ แพงกว่ามาก' },
],
},

/* ------------------------------------------------------------------ */
{
id: 'detectors', ch: 10,
title: 'Detection Models',
sub: 'โมเดล classification กับ detection แบบ two-stage และ one-stage และรูปแบบ label ที่แต่ละแบบต้องใช้',
desc: 'CNN สำหรับ classification, R-CNN (two-stage), YOLO (one-stage), YOLO label format',
body: `
<h2>โมเดล classification</h2>
<p>ใช้ CNN: ส่วน feature extraction (convolution + ReLU + pooling หลายรอบ ได้ feature maps) ต่อด้วยส่วน classification (flatten + fully connected) และ softmax ให้ความน่าจะเป็น เช่น ม้าลาย 0.7 ม้า 0.2 หมา 0.1 ในคาบใช้ <strong>MobileNetV2</strong> ที่เทรนกับ ImageNet มาแล้ว แล้วต่อหัวใหม่ให้ตอบ 2 คลาส</p>

<h2>โมเดล object detection: two-stage กับ one-stage</h2>
<div class="fig" data-fig="detectors"></div>
<h3>Two-stage เช่น R-CNN</h3>
<ol>
<li><strong>Input image</strong> รับภาพ</li>
<li><strong>Extract region proposals</strong> เสนอบริเวณที่น่าจะมีวัตถุประมาณ 2,000 บริเวณ</li>
<li><strong>Compute CNN features</strong> ปรับขนาดแต่ละบริเวณ (warped region) แล้วส่งเข้า CNN สกัด feature</li>
<li><strong>Classify regions</strong> จำแนกแต่ละบริเวณว่าเป็นอะไร เช่น person? yes, aeroplane? no</li>
</ol>
<p>แยกขั้น “หาว่าตรงไหนน่าสนใจ” กับ “บอกว่าเป็นอะไร” ออกจากกัน จึงแม่นยำ แต่ช้า เพราะต้องประมวลผลหลายบริเวณทีละอัน</p>
<h3>One-stage เช่น YOLO</h3>
<p>ทายทั้ง “มีอะไร” และ “อยู่ตรงไหน” <strong>พร้อมกันในการประมวลผลครั้งเดียว</strong> โดยแบ่งภาพเป็นกริดแล้วแต่ละช่องทำนายกรอบกับคลาสไปพร้อมกัน จึงเร็วกว่ามากและเหมาะกับงาน real-time ในคาบใช้ <strong>YOLO11</strong> ผ่านไลบรารี ultralytics (ตัว n = nano เล็กสุด, s = small, m = medium)</p>

<h2>รูปแบบ label</h2>
<p><strong>Classification</strong> ใช้ชื่อโฟลเดอร์เป็น label เช่น <code>train/Cat/cat_001.jpg</code> และ <code>train/Dog/dog_002.jpg</code></p>
<p><strong>Detection (YOLO)</strong> แยก <code>images/</code> กับ <code>labels/</code> ไฟล์ .txt 1 ไฟล์ต่อ 1 ภาพ และ 1 บรรทัดต่อ 1 กรอบ</p>
<div class="eq"><span class="m">0 &nbsp;0.4 &nbsp;0.399 &nbsp;0.677 &nbsp;0.761</span><p>class id, x กลางกรอบ, y กลางกรอบ, ความกว้าง, ความสูง</p></div>
<p>ทุกค่าเป็น<strong>สัดส่วน 0 ถึง 1 ของขนาดภาพ</strong> ไม่ใช่พิกเซล เมื่อย่อหรือขยายภาพค่าจึงยังถูกต้องโดยไม่ต้องคำนวณใหม่ และมีไฟล์ <code>data.yaml</code> บอกว่าข้อมูลอยู่ที่ไหนและมีคลาสอะไรบ้าง</p>
<div class="eq"><span class="m">x1 = (xc − w/2) × W &nbsp;&nbsp; x2 = (xc + w/2) × W<br>y1 = (yc − h/2) × H &nbsp;&nbsp; y2 = (yc + h/2) × H</span><p>แปลงจาก YOLO กลับเป็นพิกเซลมุมซ้ายบนและขวาล่าง</p></div>
<dl class="sym"><dt>xc, yc</dt><dd>จุดกึ่งกลางกรอบ (สัดส่วน)</dd><dt>w, h</dt><dd>ความกว้างและความสูงของกรอบ (สัดส่วน)</dd><dt>W, H</dt><dd>ความกว้างและความสูงของภาพเป็นพิกเซล</dd></dl>
<p>Detection ได้หลายกรอบต่อภาพ แต่ละกรอบมี confidence ของตัวเอง ไม่ได้รวมกันเป็น 100% แบบ softmax ของ classification</p>
`,
written: [
{ q: 'จงอธิบายความแตกต่างระหว่างโมเดล Object Detection แบบ Two-stage และ One-stage พร้อมยกตัวอย่าง', tag: 'เปรียบเทียบ', a: `
<p><strong>Two-stage</strong> แบ่งเป็นสองขั้น ขั้นแรกเสนอบริเวณที่น่าจะมีวัตถุ (region proposals) ขั้นที่สองนำแต่ละบริเวณเข้า CNN เพื่อจำแนกและปรับกรอบ แม่นยำสูงแต่ช้า ตัวอย่าง R-CNN (และ Fast/Faster R-CNN)</p>
<p><strong>One-stage</strong> ทำนายคลาสและตำแหน่งกรอบพร้อมกันในการประมวลผลครั้งเดียว ไม่มีขั้นเสนอบริเวณแยก จึงเร็วมาก เหมาะกับงาน real-time ตัวอย่าง YOLO และ SSD</p>` },
{ q: 'จงอธิบายขั้นตอนการทำงานของ R-CNN', a: `
<ol><li><strong>Input image</strong> รับภาพเข้า</li>
<li><strong>Extract region proposals</strong> สร้างบริเวณที่อาจมีวัตถุประมาณ 2,000 บริเวณ</li>
<li><strong>Compute CNN features</strong> ปรับขนาด (warp) แต่ละบริเวณให้เท่ากัน แล้วส่งเข้า CNN เพื่อสกัด feature</li>
<li><strong>Classify regions</strong> จำแนกแต่ละบริเวณว่าเป็นวัตถุคลาสใดหรือเป็นพื้นหลัง</li></ol>
<p>ข้อเสียคือต้องเข้า CNN ทีละบริเวณหลายพันครั้งต่อภาพ จึงช้า</p>` },
{ q: 'ทำไม YOLO จึงเร็วกว่า R-CNN และเหมาะกับงานแบบใด', a: `
<p>YOLO (You Only Look Once) เป็น one-stage detector มองภาพครั้งเดียวผ่านเครือข่ายเดียว แล้วทำนายกรอบและคลาสของทุกตำแหน่งพร้อมกัน ไม่ต้องสร้าง region proposals หลายพันบริเวณแล้วส่งเข้า CNN ทีละอันแบบ R-CNN จึงประมวลผลได้เร็วมาก</p>
<p>เหมาะกับงาน real-time เช่น กล้องวงจรปิด รถขับเคลื่อนอัตโนมัติ นับวัตถุบนสายพาน หรือแอปบนมือถือ</p>` },
{ q: 'จงอธิบายรูปแบบ label ของ YOLO และทำไมจึงใช้ค่าสัดส่วน 0 ถึง 1 แทนพิกเซล', a: `
<p>แต่ละภาพมีไฟล์ .txt หนึ่งไฟล์ แต่ละบรรทัดคือหนึ่งกรอบ เขียนเป็น <code>class_id x_center y_center width height</code> เช่น <code>0 0.4 0.399 0.677 0.761</code> คือคลาส 0 กรอบมีจุดกลางที่ 40% ของความกว้างภาพ และ 39.9% ของความสูง กรอบกว้าง 67.7% สูง 76.1% ของภาพ</p>
<p>ใช้สัดส่วนเพราะเมื่อย่อหรือขยายภาพ (เช่น ปรับเป็น imgsz 640) ค่ายังถูกต้องเหมือนเดิม ไม่ต้องคำนวณ label ใหม่</p>` },
{ q: 'Label ของงาน classification กับ detection เก็บต่างกันอย่างไร', a: `
<ul><li><strong>Classification</strong> label คือชื่อโฟลเดอร์ จัดภาพไว้ในโฟลเดอร์ตามคลาส เช่น train/Cat/ และ train/Dog/ ไลบรารีอย่าง Keras อ่านชื่อโฟลเดอร์เป็น label ให้อัตโนมัติ</li>
<li><strong>Detection</strong> แยกโฟลเดอร์ images/ กับ labels/ ภาพแต่ละภาพมีไฟล์ .txt ที่เก็บ class id และตำแหน่งกรอบของทุกวัตถุ พร้อมไฟล์ data.yaml ที่บอกตำแหน่งข้อมูลและรายชื่อคลาส</li></ul>` },
{ q: 'Confidence ของ object detection ต่างจากความน่าจะเป็นจาก softmax ของ classification อย่างไร', tag: 'คิดวิเคราะห์', a: `
<p>Softmax ของ classification ให้ความน่าจะเป็นของทุกคลาสสำหรับภาพเดียว ผลรวมเป็น 1 และเลือกคลาสสูงสุดเป็นคำตอบเดียว</p>
<p>Detection ให้หลายกรอบต่อภาพ แต่ละกรอบมี confidence ของตัวเองซึ่งบอกว่ามั่นใจแค่ไหนว่ากรอบนั้นมีวัตถุคลาสนั้น ค่า confidence ของกรอบต่าง ๆ ไม่ได้รวมกันเป็น 100% และกรอบที่ confidence ต่ำกว่าเกณฑ์ (เช่น conf = 0.25) จะถูกตัดทิ้ง</p>` },
],
mcq: [
{ q: 'R-CNN เสนอ region proposals ประมาณกี่บริเวณต่อภาพ', o: ['~20', '~200', '~2,000', '~20,000'], a: 2, why: 'สไลด์ระบุ Extract region proposals (~2k)' },
{ q: 'YOLO เป็นโมเดลแบบใด', o: ['Two-stage', 'One-stage', 'Classification อย่างเดียว', 'Segmentation อย่างเดียว'], a: 1, why: 'YOLO ทายคลาสและกรอบพร้อมกันในการประมวลผลครั้งเดียว' },
{ q: 'บรรทัด label “1 0.5 0.5 0.2 0.4” ของ YOLO ภาพขนาด 1000×500 กรอบกว้างกี่พิกเซล', o: ['100', '200', '400', '500'], a: 1, why: 'w = 0.2 × 1000 = 200 พิกเซล' },
{ q: 'ค่าตัวเลขตัวที่ 2 และ 3 ใน label YOLO คืออะไร', o: ['มุมซ้ายบนของกรอบ', 'จุดกึ่งกลางกรอบ (x, y)', 'ความกว้างและความสูง', 'confidence'], a: 1, why: 'รูปแบบคือ class, x_center, y_center, width, height' },
{ q: 'ข้อใดเป็นข้อได้เปรียบของ two-stage detector', o: ['เร็วที่สุด', 'มักแม่นยำกว่า', 'ไม่ต้องใช้ CNN', 'ไม่ต้องมี label'], a: 1, why: 'แยกขั้นเสนอบริเวณกับจำแนก จึงแม่นยำแต่ช้ากว่า one-stage' },
{ q: 'ไฟล์ใดที่บอก YOLO ว่าข้อมูลอยู่ที่ไหนและมีคลาสอะไร', o: ['labels.txt', 'data.yaml', 'model.pt', 'classes.csv'], a: 1, why: 'Roboflow export ไฟล์ data.yaml มาให้' },
],
},

/* ------------------------------------------------------------------ */
{
id: 'training', ch: 10,
title: 'Training a Model',
sub: 'โมเดลเรียนรู้อย่างไร batch และ epoch คืออะไร แบ่งข้อมูลยังไง และเตรียม dataset ใน Roboflow',
desc: 'วงจรเรียนรู้ 6 ขั้น + backprop, batch/epoch, train/valid/test, overfitting, transfer learning, augmentation, Roboflow',
body: `
<h2>หลักการเรียนรู้ของโมเดล</h2>
<div class="fig" data-fig="trainloop"></div>
<ol>
<li>โมเดลรับภาพ</li>
<li>ประมวลผลและแสดงผลลัพธ์ (เช่น dog 0.7, cat 0.3 หรือกรอบของวัตถุ)</li>
<li>เปรียบเทียบผลลัพธ์กับเฉลย ได้ค่า <strong>loss</strong> ว่าทายผิดไปแค่ไหน</li>
<li>ประมวลผลแพร่กลับ <strong>(back propagation)</strong> หาว่าน้ำหนักแต่ละตัวมีส่วนทำให้ผิดเท่าไร</li>
<li>อัปเดตค่าของแต่ละเซลล์ (weights) ภายในชั้นต่าง ๆ</li>
<li>ทำวนซ้ำขั้นที่ 1 ถึง 5 ไปเรื่อย ๆ</li>
</ol>

<h2>การตั้งค่าโมเดล</h2>
<ol>
<li><strong>เลือกโมเดล</strong> ให้สอดคล้องกับงาน (classification หรือ detection)</li>
<li><strong>Batch</strong> กลุ่มตัวอย่างข้อมูลขนาดเล็กที่ใช้ร่วมกันในหนึ่งขั้นตอนการฝึก (training step)</li>
<li><strong>Epoch</strong> การวนใช้ข้อมูลทั้งหมดใน dataset ครบหนึ่งรอบ ฝึกซ้ำหลาย epoch เพื่อให้โมเดลเก่งขึ้น</li>
</ol>
<div class="eq"><span class="m">steps ต่อ 1 epoch = จำนวนภาพ / batch size</span><p>1,000 ภาพ batch 100 → 10 steps จึงเท่ากับ 1 epoch</p></div>
<div class="fig" data-fig="batch"></div>
<p>ค่าที่เราตั้งเองเหล่านี้เรียกว่า <strong>hyperparameter</strong> (เช่น epochs, batch, imgsz, learning rate, seed) ต่างจาก weights ที่โมเดลเรียนรู้เอง</p>
<ul>
<li><strong>Learning rate</strong> ขยับน้ำหนักทีละแค่ไหน สูงไปการเทรนพัง ต่ำไปช้า ตอน fine-tune ทั้งโมเดลใช้ค่าต่ำ (1e-4) เพื่อไม่ลบความรู้เดิม</li>
<li><strong>Optimizer</strong> วิธีปรับน้ำหนัก เช่น Adam</li>
<li><strong>Batch ใหญ่เกินไป</strong> ทำให้หน่วยความจำการ์ดจอไม่พอ (CUDA out of memory)</li>
<li><strong>imgsz</strong> เล็กไปมองไม่เห็นของเล็ก ใหญ่ไปช้าและกิน VRAM</li>
<li><strong>Seed</strong> ตั้งตัวเลขสุ่มให้รันซ้ำได้ผลใกล้เดิม</li>
</ul>

<h2>แบ่งข้อมูล 3 ชุด</h2>
<div class="tbl-wrap"><table class="tbl">
<tr><th>ชุด</th><th>ใช้ทำอะไร</th><th>เปรียบเทียบ</th></tr>
<tr><td>Train set</td><td>ให้โมเดลเรียน</td><td>แบบฝึกหัดพร้อมเฉลย</td></tr>
<tr><td>Valid set</td><td>เช็กระหว่างเทรนว่าไปถูกทางไหม</td><td>ข้อสอบย่อย</td></tr>
<tr><td>Test set</td><td>วัดผลครั้งเดียวตอนจบ โมเดลไม่เคยเห็น</td><td>ข้อสอบไฟนอล ห้ามแอบดู</td></tr>
</table></div>
<p>ถ้าเอา test set มาปรับโมเดลไปมา มันจะกลายเป็น valid set อีกชุด ตัวเลขที่รายงานจะเชื่อไม่ได้</p>
<p><strong>Overfitting</strong> คือโมเดลท่องจำข้อมูล train ได้ แต่ทำข้อมูลใหม่ไม่ได้ ดูจาก learning curve: ถ้าเส้น train ดีขึ้นแต่เส้น valid แย่ลง แปลว่าเริ่มท่องจำแล้วควรหยุด ถ้าทั้งสองเส้นดีขึ้นแปลว่าเรียนรู้ได้ดี ถ้าทั้งคู่ไม่ขยับแปลว่าข้อมูลหรือการตั้งค่ามีปัญหา</p>

<h2>Transfer learning และ augmentation</h2>
<p><strong>Transfer learning</strong> คือนำโมเดลที่เทรนกับข้อมูลขนาดใหญ่มาแล้วมาเทรนต่อ (fine-tune) กับงานของเรา เหมือนจ้างคนที่ดูภาพเก่งอยู่แล้วมาฝึกงานใหม่ เช่น MobileNetV2 ที่เทรนกับ ImageNet 1.2 ล้านภาพ 1,000 คลาส ตัด “ส่วนตอบ” เดิมทิ้งแล้วต่อ Dense layer ใหม่ที่ตอบแค่ Cat/Dog และ YOLO11n ที่เทรนกับ COCO มาแล้ว ทำให้ใช้ข้อมูลน้อยได้</p>
<p><strong>Augmentation</strong> คือเพิ่มความหลากหลายของข้อมูลด้วยการดัดแปลงภาพเดิม เช่น พลิกซ้ายขวา หมุน ปรับสี ครอป ภาพ 20 ภาพกลายเป็น 60 ภาพที่ต่างกันเล็กน้อย ช่วยลด overfitting ทำได้ที่ Roboflow (เห็นผลก่อนเทรน ทุกคนได้ข้อมูลชุดเดียวกัน) หรือในโค้ด (เปลี่ยนได้ทันที) แต่<strong>ห้ามทำทั้งสองที่พร้อมกัน</strong> ภาพจะถูกดัดแปลงซ้อนจนเพี้ยน ส่วน YOLO ทำ augmentation ให้อัตโนมัติตอน train เช่น ต่อ 4 ภาพเป็นภาพเดียว (mosaic)</p>

<h2>เตรียม dataset ด้วย Roboflow</h2>
<ol>
<li>สร้าง project เลือกชนิดงาน (classification หรือ object detection)</li>
<li>Upload ภาพ</li>
<li>ทำเฉลย (annotate) ติดป้ายคลาส หรือวาดกรอบรอบวัตถุ ภาพที่ทำเสร็จจะไปรวมอยู่ในชุดข้อมูล</li>
<li>สร้าง version: แบ่ง train / valid / test, preprocessing และ augmentation</li>
<li>Export ในรูปแบบที่โมเดลต้องการ เช่น โฟลเดอร์ตามคลาส หรือ YOLO + data.yaml</li>
</ol>
<p>ดูข้อมูลด้วยตาก่อนเทรนเสมอ บั๊กส่วนใหญ่ (label สลับ ภาพเสีย ภาพซ้ำ กรอบไม่ตรง) อยู่ในข้อมูล และเมื่อโมเดลไม่ดี การเพิ่มและแก้ข้อมูลมักคุ้มกว่าการจูน hyperparameter</p>
<p><strong>Inference</strong> คือการนำโมเดลที่เทรนเสร็จแล้วไปทายภาพใหม่ “จบการฝึก ลงสนามจริง” ต้องเตรียมภาพแบบเดียวกับตอนเทรน (ขนาดและการปรับค่าสี) มิฉะนั้นผลจะมั่วโดยไม่มี error แจ้ง</p>
`,
written: [
{ q: 'จงอธิบายหลักการเรียนรู้ของโมเดล (training loop) ทั้ง 6 ขั้นตอน', a: `
<ol><li>โมเดลรับภาพ (input data)</li>
<li>ประมวลผลและแสดงผลลัพธ์การทำนาย (predicted results) เช่น dog 0.7, cat 0.3</li>
<li>เปรียบเทียบผลลัพธ์กับเฉลย คำนวณค่า loss ว่าผิดมากน้อยเท่าไร</li>
<li>ทำ back propagation ส่งค่าความผิดพลาดย้อนกลับไปในแต่ละชั้น</li>
<li>อัปเดตค่า weights ของแต่ละเซลล์ในชั้นต่าง ๆ ให้ loss ลดลง</li>
<li>วนซ้ำขั้นที่ 1 ถึง 5 ไปเรื่อย ๆ จนโมเดลทายได้ดี</li></ol>` },
{ q: 'Batch และ Epoch คืออะไร ถ้ามีภาพ 1,000 ภาพ และ batch size = 100 ต้องใช้กี่ step ต่อ 1 epoch ถ้าเทรน 10 epochs จะอัปเดตน้ำหนักกี่ครั้ง', a: `
<p><strong>Batch</strong> คือกลุ่มตัวอย่างข้อมูลขนาดเล็กที่นำมาใช้ร่วมกันในหนึ่งขั้นตอนการฝึก (training step) <strong>Epoch</strong> คือการวนใช้ข้อมูลทั้งหมดใน dataset ครบหนึ่งรอบ</p>
<p>steps ต่อ epoch = 1,000 / 100 = <strong>10 steps</strong></p>
<p>เทรน 10 epochs จึงอัปเดตน้ำหนัก 10 × 10 = <strong>100 ครั้ง</strong> (อัปเดตหนึ่งครั้งต่อหนึ่ง batch)</p>` },
{ q: 'Train set, Validation set และ Test set ใช้ต่างกันอย่างไร ทำไมจึงห้ามใช้ test set ในการปรับโมเดล', a: `
<ul><li><strong>Train set</strong> ให้โมเดลเรียนรู้และปรับ weights</li>
<li><strong>Validation set</strong> ใช้ตรวจระหว่างเทรนว่าโมเดลไปถูกทางหรือไม่ ใช้เลือกค่า hyperparameter และดู overfitting</li>
<li><strong>Test set</strong> ใช้วัดผลครั้งเดียวตอนจบ เป็นข้อมูลที่โมเดลไม่เคยเห็นเลย</li></ul>
<p>ถ้านำ test set มาปรับโมเดล เราจะเลือกค่าที่เข้ากับ test set โดยบังเอิญ ทำให้ test set กลายเป็น validation set อีกชุด ผลที่รายงานจะสูงเกินจริงและไม่สะท้อนประสิทธิภาพกับข้อมูลใหม่</p>` },
{ q: 'Overfitting คืออะไร ดูได้อย่างไรจาก learning curve และมีวิธีลดอย่างไรบ้าง', a: `
<p>Overfitting คือโมเดลจดจำข้อมูล train ได้ดีมาก (รวมถึง noise) แต่ทำนายข้อมูลใหม่ได้แย่ เหมือนท่องข้อสอบเก่าแต่ทำข้อใหม่ไม่ได้</p>
<p>ดูจาก learning curve: accuracy ของ train ยังดีขึ้น (loss ลดลง) แต่ของ validation หยุดดีขึ้นหรือแย่ลง</p>
<p>วิธีลด: เพิ่มข้อมูล, ใช้ data augmentation, ใช้ transfer learning, หยุดเทรนเร็วขึ้น (ลด epochs / early stopping), ใช้โมเดลที่เล็กลง</p>` },
{ q: 'Transfer learning คืออะไร มีประโยชน์อย่างไร จงยกตัวอย่างจาก workshop', a: `
<p>Transfer learning คือการนำโมเดลที่ถูกเทรนกับข้อมูลขนาดใหญ่มาแล้วมาเทรนต่อ (fine-tune) กับงานใหม่ของเรา แทนการเริ่มจากศูนย์ เพราะโมเดลมีความรู้เรื่องลักษณะของภาพ (ขอบ ลวดลาย รูปทรง) ติดตัวมาแล้ว</p>
<p>ประโยชน์: ใช้ข้อมูลน้อยได้ เทรนเร็ว และได้ความแม่นยำสูงกว่าเทรนเองจากศูนย์</p>
<p>ตัวอย่าง: นำ MobileNetV2 ที่เทรนกับ ImageNet (1.2 ล้านภาพ 1,000 คลาส) มาตัดชั้นตอบเดิมออก ต่อ Dense layer ใหม่ให้ตอบ Cat/Dog แล้วเทรนต่อด้วย learning rate ต่ำ (1e-4) และใช้ YOLO11n ที่เทรนกับ COCO มาแล้วมาเทรนต่อสำหรับการตรวจจับหมาแมว</p>` },
{ q: 'Data augmentation คืออะไร มีประโยชน์อย่างไร และทำไมไม่ควรทำทั้งใน Roboflow และในโค้ดพร้อมกัน', a: `
<p>Data augmentation คือการเพิ่มความหลากหลายของข้อมูลโดยดัดแปลงภาพเดิม เช่น พลิกซ้ายขวา หมุน ปรับสี ครอป ทำให้ภาพจำนวนน้อยกลายเป็นข้อมูลที่หลากหลายขึ้น โมเดลจึงทนต่อการเปลี่ยนแปลงและลด overfitting</p>
<p>ไม่ควรทำสองที่พร้อมกัน เพราะภาพจะถูกดัดแปลงซ้อนสองชั้นจนเพี้ยนเกินจริง (เช่น หมุนสองต่อ สีผิดเพี้ยนมาก) ควรเลือกทำที่ใดที่หนึ่ง</p>` },
{ q: 'Hyperparameter คืออะไร ต่างจาก weights อย่างไร จงยกตัวอย่างพร้อมผลถ้าตั้งค่าไม่เหมาะสม', a: `
<p>Hyperparameter คือค่าที่ผู้ใช้กำหนดเองก่อนเทรน ไม่ได้เรียนรู้จากข้อมูล ส่วน weights คือค่าภายในโมเดลที่ถูกปรับระหว่างการเทรน</p>
<ul><li><strong>epochs</strong> น้อยไปยังเรียนไม่พอ มากไป overfit</li>
<li><strong>batch</strong> ใหญ่ไปหน่วยความจำ GPU ไม่พอ (CUDA out of memory)</li>
<li><strong>imgsz</strong> เล็กไปมองไม่เห็นวัตถุเล็ก ใหญ่ไปช้าและใช้ VRAM มาก</li>
<li><strong>learning rate</strong> สูงไปการเทรนไม่ลู่เข้าหรือทำลายความรู้เดิม ต่ำไปเรียนช้า</li>
<li><strong>seed</strong> ไม่ตั้ง รันซ้ำแล้วได้ผลไม่เหมือนเดิม</li></ul>` },
{ q: 'จงอธิบายขั้นตอนการเตรียม dataset ด้วย Roboflow', a: `
<ol><li>สร้าง project และเลือกชนิดงาน (classification / object detection)</li>
<li>อัปโหลดภาพเข้าโปรเจกต์</li>
<li>ทำเฉลย (annotation) ระบุคลาส หรือวาด bounding box รอบวัตถุทุกชิ้น</li>
<li>สร้าง dataset version: แบ่ง train/valid/test ตั้งค่า preprocessing และ augmentation</li>
<li>Export ในรูปแบบที่ต้องการ เช่น โฟลเดอร์ตามคลาสสำหรับ classification หรือ YOLO format พร้อม data.yaml สำหรับ detection</li></ol>
<p>ควรเปิดดูข้อมูลด้วยตาก่อนเทรนเสมอ เพื่อหา label ที่ผิด ภาพเสีย หรือภาพซ้ำ</p>` },
],
mcq: [
{ q: 'ภาพ 2,400 ภาพ batch size 32 ต้องใช้ step ต่อ epoch ประมาณเท่าใด', o: ['32', '75', '240', '2,400'], a: 1, why: '2,400 / 32 = 75 steps' },
{ q: 'Epoch หมายถึง', o: ['การอัปเดตน้ำหนัก 1 ครั้ง', 'ภาพ 1 กลุ่มเล็ก', 'การวนใช้ข้อมูลทั้งหมดครบ 1 รอบ', 'จำนวนชั้นของโมเดล'], a: 2, why: 'Epoch = ใช้ข้อมูลครบหนึ่งรอบ ส่วน batch คือกลุ่มเล็กต่อหนึ่ง step' },
{ q: 'ขั้นตอนใดเกิดหลังการเปรียบเทียบผลลัพธ์กับเฉลยทันที', o: ['รับภาพ', 'Back propagation', 'Inference', 'Export dataset'], a: 1, why: 'ลำดับคือ ทาย → เทียบเฉลย (loss) → back propagation → update weights' },
{ q: 'Train accuracy เพิ่มขึ้นต่อเนื่อง แต่ validation accuracy ลดลง แปลว่า', o: ['Underfitting', 'Overfitting', 'เรียนรู้ได้ดี', 'Learning rate ต่ำไป'], a: 1, why: 'โมเดลเริ่มท่องจำข้อมูล train ควรหยุดหรือเพิ่มข้อมูล/augmentation' },
{ q: 'ข้อมูลชุดใดควรใช้เพียงครั้งเดียวตอนจบเพื่อรายงานผล', o: ['Train', 'Validation', 'Test', 'Augmented'], a: 2, why: 'Test set เก็บไว้วัดผลสุดท้าย ห้ามใช้ปรับโมเดล' },
{ q: 'ข้อใดเป็น hyperparameter', o: ['Weights ของ filter', 'Bias ของ neuron', 'Learning rate', 'ค่าใน feature map'], a: 2, why: 'Learning rate เป็นค่าที่เราตั้งเอง ส่วน weights และ bias โมเดลเรียนรู้เอง' },
{ q: 'MobileNetV2 ในคาบถูกเทรนมาก่อนกับข้อมูลชุดใด', o: ['COCO', 'ImageNet', 'MNIST', 'Roboflow'], a: 1, why: 'ImageNet 1.2 ล้านภาพ 1,000 คลาส ส่วน YOLO11 เทรนกับ COCO' },
{ q: 'Augmentation ไม่ได้ช่วยเรื่องใด', o: ['ลด overfitting', 'เพิ่มความหลากหลายของข้อมูล', 'ทำให้ label ที่ผิดกลายเป็นถูก', 'ทำให้โมเดลทนการพลิกหรือหมุนภาพ'], a: 2, why: 'Augmentation ดัดแปลงภาพเดิม ถ้า label ผิดตั้งแต่ต้นก็จะผิดทุกภาพที่ดัดแปลง' },
],
},

/* ------------------------------------------------------------------ */
{
id: 'metrics', ch: 10,
title: 'Measuring Performance',
sub: 'Confusion matrix, accuracy, precision, recall, F1 สำหรับ classification และ IoU, AP, mAP สำหรับ detection',
desc: 'TP/TN/FP/FN, ทำไม accuracy หลอก, P กับ R แลกกัน, IoU, AP, mAP@0.5, mAP@0.5:0.95',
body: `
<h2>Confusion matrix</h2>
<p>ทุก metric ของ classification คำนวณจากของ 2 อย่าง คือคำตอบจริง (y_true) กับคำตอบที่โมเดลทาย (y_pred) นำมานับเป็นตาราง สมมติให้ “หมา” เป็นคลาส positive</p>
<div class="fig" data-fig="confusion"></div>
<dl class="sym"><dt>TP</dt><dd>True Positive ทายถูก: หมาจริง และทายเป็นหมา</dd><dt>TN</dt><dd>True Negative ทายถูก: แมวจริง และทายเป็นแมว</dd><dt>FP</dt><dd>False Positive ทายผิด: แมวจริง แต่ทายเป็นหมา (หลอน)</dd><dt>FN</dt><dd>False Negative ทายผิด: หมาจริง แต่ทายเป็นแมว (พลาด)</dd></dl>
<p>แนวทแยงของตารางคือทายถูก นอกแนวทแยงคือทายผิด confusion matrix บอกว่า “ผิดแบบไหน” ไม่ใช่แค่ “ผิดกี่ข้อ” จึงชี้จุดที่ต้องแก้ เช่น พลาดหมาเป็นแมวบ่อยก็ไปเก็บภาพหมาเพิ่ม</p>

<h2>4 metric หลัก</h2>
<div class="eq"><span class="m">Accuracy = (TP + TN) / ทั้งหมด</span><p>ทายถูกกี่ % จากทั้งหมด</p></div>
<div class="eq"><span class="m">Precision = TP / (TP + FP)</span><p>ที่โมเดลบอกว่าเป็นหมา เป็นหมาจริงกี่ % สูง = ไม่ค่อยหลอน</p></div>
<div class="eq"><span class="m">Recall = TP / (TP + FN)</span><p>หมาจริงทั้งหมด โมเดลหาเจอกี่ % สูง = ไม่ค่อยพลาด</p></div>
<div class="eq"><span class="m">F1 = 2 × P × R / (P + R)</span><p>ค่าเฉลี่ยแบบ harmonic ของ precision กับ recall ต้องดีทั้งคู่จึงจะสูง</p></div>
<p>ตัวอย่างในสไลด์: โมเดลบอกว่าเป็นหมา 100 รูปแต่เป็นหมาจริง 80 รูป precision = 80% มีหมาจริง 100 รูปโมเดลหาเจอ 90 รูป recall = 90% จึงได้ F1 = 2(0.8)(0.9)/(1.7) ≈ 0.85</p>
<p><strong>Accuracy หลอกได้ง่ายเมื่อข้อมูลไม่สมดุล</strong> ถ้าคน 1,000 คนป่วยแค่ 5 คน หมอที่ตอบว่า “ไม่ป่วย” ทุกคนได้ accuracy 99.5% แต่ recall = 0% คือไม่เจอคนป่วยเลยสักคน</p>

<h2>Precision กับ Recall แลกกัน</h2>
<div class="fig" data-fig="threshold"></div>
<p>อยากไม่พลาดเลย (recall สูง) ก็ต้องลด threshold ยอมทายเผื่อไว้ ซึ่งทำให้หลอนมากขึ้น (precision ตก) F1 คือตัวที่บังคับให้สองค่าสมดุล งานคัดกรองมะเร็งควรเน้น recall เพราะพลาดคนป่วยอันตรายกว่า ส่วนตัวกรองอีเมลสแปมควรเน้น precision เพราะไม่อยากให้อีเมลสำคัญหายไปอยู่ในสแปม</p>
<p>เมื่อมีหลายคลาส <strong>macro average</strong> เฉลี่ยทุกคลาสโดยให้น้ำหนักเท่ากัน (คลาสเล็กไม่ถูกกลบ) ส่วน <strong>weighted average</strong> ถ่วงตามจำนวนภาพของแต่ละคลาส</p>

<h2>วัดผล object detection</h2>
<p>Detection ต้องถูก 2 อย่างพร้อมกัน คือ<strong>ทายชื่อถูก</strong>และ<strong>วาดกรอบตรงพอ</strong> “ตรงพอ” วัดด้วย IoU</p>
<div class="eq"><span class="m">IoU = พื้นที่ที่ซ้อนกัน / พื้นที่รวมของสองกรอบ</span><p>Intersection over Union เทียบกรอบที่โมเดลทายกับกรอบจริง ได้ 0 ถึง 1</p></div>
<div class="fig" data-fig="iou"></div>
<p>กรอบซ้อนกันมาก IoU สูง (เช่น 0.8) กรอบคลาดเคลื่อน IoU ต่ำ (เช่น 0.2) ใช้เป็นเกณฑ์ว่ากรอบนี้นับว่าถูกหรือยัง เช่น IoU ≥ 0.5 แล้ว precision กับ recall ของ detection ก็นับ “ทายถูก” เฉพาะกรอบที่ผ่านเกณฑ์ IoU เช่น โมเดลบอกว่าพบฟัน 100 ซี่ ตรงกับฟันจริง 90 ซี่ precision = 90% และในภาพมีฟันจริง 100 ซี่ หาเจอ 90 ซี่ recall = 90%</p>
<ul>
<li><strong>AP (Average Precision)</strong> โดยรวมแล้วตรวจจับคลาสนี้ได้ดีแค่ไหน สรุปความสัมพันธ์ระหว่าง precision และ recall ในหลาย confidence threshold คือพื้นที่ใต้กราฟ precision–recall เช่น AP@0.5 นับว่าถูกเมื่อ IoU ≥ 0.5</li>
<li><strong>mAP (mean Average Precision)</strong> นำ AP ของแต่ละคลาสมาเฉลี่ยกัน ใช้เปรียบเทียบโมเดลโดยรวม เช่น Tooth 90%, Caries 80%, Filling 70% → mAP = 80%</li>
<li><strong>mAP@0.5 (mAP50)</strong> ใช้ IoU ≥ 0.5 เป็นเกณฑ์ ยอมให้กรอบคลาดเคลื่อนได้ระดับหนึ่ง เข้าใจง่ายและนิยมรายงานที่สุด</li>
<li><strong>mAP@0.5:0.95 (mAP50-95)</strong> คำนวณ mAP ที่ IoU หลายระดับตั้งแต่ 0.50 ถึง 0.95 (ทีละ 0.05) แล้วเฉลี่ย เข้มงวดกว่า mAP50 มาก ค่าจึงต่ำกว่าเสมอ สะท้อนทั้งการหาเจอและความแม่นของตำแหน่งกรอบ</li>
</ul>
<p>Precision กับ recall ต้องเลือก confidence threshold ก่อน เปลี่ยน threshold ตัวเลขก็เปลี่ยน แต่ mAP วัดทุก threshold แล้วเฉลี่ย จึงเป็นตัวเลขเดียวที่ใช้เทียบข้ามโมเดลได้ตรง ๆ</p>
<p>Confusion matrix ของ detection มีช่องพิเศษชื่อ <strong>background</strong>: ของจริงมีแต่โมเดลไม่เห็นเลยนับเป็น FN (พลาด) และไม่มีอะไรแต่โมเดลวาดกรอบนับเป็น FP (หลอน) ตารางของ 2 คลาสจึงเป็น 3×3 และระวังว่า Ultralytics ใช้แถว = ที่ทำนาย คอลัมน์ = ของจริง ซึ่งกลับด้านกับ scikit-learn</p>
<p>mAP ของ detection มักต่ำกว่า accuracy ของ classification เป็นเรื่องปกติ เพราะงานยากกว่า (ต้องถูกทั้งชื่อและตำแหน่ง) ข้อมูลน้อย (20 ภาพต่อคลาส ขณะที่งานจริงใช้หลายร้อยถึงพันภาพ) และ test set เล็กจนพลาดภาพเดียวตัวเลขก็แกว่งแรง</p>
`,
written: [
{ q: 'จงอธิบายความหมายของ TP, TN, FP, FN ใน confusion matrix โดยยกตัวอย่างการจำแนกหมา (positive) กับแมว', a: `
<ul><li><strong>TP (True Positive)</strong> ภาพเป็นหมาจริง และโมเดลทายว่าหมา (ทายถูก)</li>
<li><strong>TN (True Negative)</strong> ภาพเป็นแมวจริง และโมเดลทายว่าแมว (ทายถูก)</li>
<li><strong>FP (False Positive)</strong> ภาพเป็นแมวจริง แต่โมเดลทายว่าหมา (ทายผิดแบบหลอน)</li>
<li><strong>FN (False Negative)</strong> ภาพเป็นหมาจริง แต่โมเดลทายว่าแมว (ทายผิดแบบพลาด)</li></ul>
<p>ตัวอย่างในสไลด์ TP = 90, FN = 10, FP = 5, TN = 95 แนวทแยงคือทายถูก</p>` },
{ q: 'จงอธิบายความหมายของ Accuracy, Precision, Recall และ F1-score พร้อมสูตร', a: `
<ul><li><strong>Accuracy</strong> = (TP+TN)/ทั้งหมด สัดส่วนที่ทายถูกทั้งหมด</li>
<li><strong>Precision</strong> = TP/(TP+FP) จากที่โมเดลบอกว่าเป็น positive เป็นจริงกี่ % ค่าสูงแปลว่าทายผิดแบบหลอนน้อย</li>
<li><strong>Recall</strong> = TP/(TP+FN) จาก positive ที่มีอยู่จริง โมเดลหาเจอกี่ % ค่าสูงแปลว่าพลาดน้อย</li>
<li><strong>F1-score</strong> = 2PR/(P+R) ค่าเฉลี่ยแบบ harmonic ของ precision และ recall จะสูงได้เมื่อทั้งสองค่าดี ใช้ดูความสมดุล</li></ul>` },
{ q: 'ทำไมการใช้ Accuracy อย่างเดียวจึงไม่พอในการวัดผลโมเดล จงยกตัวอย่าง', tag: 'คิดวิเคราะห์', a: `
<p>เพราะเมื่อข้อมูลไม่สมดุล (คลาสหนึ่งมีจำนวนมากกว่าอีกคลาสมาก) โมเดลที่ทายคลาสใหญ่ตลอดก็ได้ accuracy สูงโดยไม่ได้เรียนรู้อะไรเลย</p>
<p>ตัวอย่าง: ตรวจโรคในคน 1,000 คนที่ป่วยจริงเพียง 5 คน ถ้าโมเดลตอบว่า “ไม่ป่วย” ทุกคน จะถูก 995 คน accuracy = 99.5% แต่ TP = 0 recall = 0% คือไม่พบผู้ป่วยเลย จึงต้องดู precision, recall, F1 และ confusion matrix ประกอบ</p>` },
{ q: 'Precision กับ Recall สัมพันธ์กันอย่างไร งานแบบใดควรเน้นค่าใด จงยกตัวอย่าง', tag: 'คิดวิเคราะห์', a: `
<p>ทั้งสองค่ามักแลกกัน (trade-off) ผ่าน threshold: ลด threshold โมเดลจะทายว่าเป็น positive ง่ายขึ้น หาเจอมากขึ้น (recall เพิ่ม) แต่ทายผิดแบบหลอนมากขึ้น (precision ลด) เพิ่ม threshold ก็ได้ผลตรงข้าม</p>
<ul><li><strong>เน้น recall</strong> เมื่อการพลาดอันตราย เช่น คัดกรองมะเร็ง ตรวจหาคนเดินถนนในรถขับเคลื่อนอัตโนมัติ</li>
<li><strong>เน้น precision</strong> เมื่อการหลอนเสียหาย เช่น ตัวกรองสแปม (ไม่อยากให้อีเมลสำคัญหาย) ระบบแจ้งเตือนที่การเตือนผิดบ่อยทำให้คนไม่เชื่อ</li></ul>
<p>ถ้าต้องการทั้งคู่ให้ดูที่ F1</p>` },
{ q: 'IoU คืออะไร ใช้ทำอะไรในการวัดผล object detection', a: `
<p>IoU (Intersection over Union) = พื้นที่ส่วนที่ซ้อนกันของกรอบที่โมเดลทายกับกรอบจริง ÷ พื้นที่รวมของทั้งสองกรอบ มีค่า 0 ถึง 1 ยิ่งกรอบซ้อนกันมาก IoU ยิ่งสูง</p>
<p>ใช้เป็นเกณฑ์ตัดสินว่ากรอบที่ทายนับว่า “ถูกตำแหน่ง” หรือไม่ เช่น IoU ≥ 0.5 นับว่าถูก (เป็น TP ถ้าคลาสถูกด้วย) ถ้าต่ำกว่าเกณฑ์นับเป็น FP จากนั้นจึงนำไปคำนวณ precision, recall, AP และ mAP</p>` },
{ q: 'จงอธิบายความหมายของ AP และ mAP และความแตกต่างระหว่าง mAP@0.5 กับ mAP@0.5:0.95', a: `
<p><strong>AP (Average Precision)</strong> บอกว่าโมเดลตรวจจับคลาสหนึ่งได้ดีแค่ไหนโดยรวม สรุปความสัมพันธ์ของ precision และ recall ที่หลาย confidence threshold คือพื้นที่ใต้กราฟ precision–recall</p>
<p><strong>mAP (mean Average Precision)</strong> คือค่าเฉลี่ย AP ของทุกคลาส ใช้เปรียบเทียบโมเดลโดยรวม เช่น AP ของ Tooth, Caries, Filling = 90, 80, 70% ได้ mAP = 80%</p>
<ul><li><strong>mAP@0.5</strong> นับว่าถูกเมื่อ IoU ≥ 0.5 ยอมให้กรอบคลาดได้บ้าง นิยมรายงาน</li>
<li><strong>mAP@0.5:0.95</strong> คำนวณที่ IoU 0.50, 0.55, …, 0.95 แล้วเฉลี่ย เข้มงวดกว่ามาก ค่าต่ำกว่า สะท้อนทั้งการหาเจอและความแม่นของตำแหน่งกรอบ</li></ul>` },
{ q: 'ทำไมการวัดผล object detection จึงใช้ accuracy แบบ classification ไม่ได้ และทำไม mAP ของ detection มักต่ำกว่า accuracy ของ classification', a: `
<p>Detection ต้องถูกสองอย่างพร้อมกัน คือคลาสถูกและกรอบตรงพอ และในภาพหนึ่งมีวัตถุได้หลายชิ้นหรือไม่มีเลย จึงไม่มี “คำตอบเดียวต่อภาพ” ให้นับถูกผิดแบบ accuracy ต้องใช้ IoU ตัดสินแต่ละกรอบ แล้ววัดด้วย precision, recall และ mAP ซึ่งรวมกรณีหาไม่เจอ (FN) และทายกรอบเกิน (FP) ด้วย</p>
<p>mAP มักต่ำกว่าเพราะงานยากกว่า (ต้องถูกทั้งชื่อและตำแหน่ง) ต้องการข้อมูลมากกว่ามาก และ test set ที่เล็กทำให้ตัวเลขแกว่งแรง</p>` },
{ q: 'Confusion matrix ของ object detection ต่างจากของ classification อย่างไร', a: `
<p>Detection มีคลาสพิเศษชื่อ <strong>background</strong> เพิ่มเข้ามา เพราะมีสองกรณีที่ classification ไม่มี คือ วัตถุมีอยู่จริงแต่โมเดลไม่วาดกรอบเลย (นับเป็นพลาด FN) และไม่มีวัตถุแต่โมเดลวาดกรอบขึ้นมา (นับเป็นหลอน FP) ดังนั้นงาน 2 คลาส (Cat, Dog) จะมีตาราง 3×3</p>
<p>นอกจากนี้ Ultralytics วางแถวเป็นค่าที่ทำนายและคอลัมน์เป็นค่าจริง ซึ่งกลับด้านกับ scikit-learn ต้องอ่านแกนให้ถูก</p>` },
],
mcq: [
{ q: 'TP = 90, FN = 10, FP = 5, TN = 95 ค่า Recall เท่ากับ', o: ['90%', '94.7%', '92.5%', '95%'], a: 0, why: 'Recall = TP/(TP+FN) = 90/100 = 90%' },
{ q: 'TP = 90, FN = 10, FP = 5, TN = 95 ค่า Accuracy เท่ากับ', o: ['90%', '92.5%', '94.7%', '95%'], a: 1, why: '(90 + 95)/200 = 185/200 = 92.5%' },
{ q: 'โมเดลบอกว่าเป็นหมา 100 รูป แต่เป็นหมาจริง 80 รูป ค่าใดเท่ากับ 80%', o: ['Recall', 'Precision', 'Accuracy', 'IoU'], a: 1, why: 'จากที่โมเดลบอกว่าเป็น positive ถูกจริงกี่ % คือ precision' },
{ q: 'แมวจริงแต่โมเดลทายว่าหมา (หมา = positive) นับเป็น', o: ['TP', 'TN', 'FP', 'FN'], a: 2, why: 'ทายว่า positive แต่ผิด จึงเป็น False Positive' },
{ q: 'งานคัดกรองมะเร็งควรให้ความสำคัญกับค่าใดมากที่สุด', o: ['Precision', 'Recall', 'Accuracy', 'จำนวน epoch'], a: 1, why: 'พลาดคนป่วยอันตรายกว่า จึงต้องการ recall สูง' },
{ q: 'กรอบทายกับกรอบจริงซ้อนกัน 40 หน่วย พื้นที่รวมของสองกรอบ 100 หน่วย IoU เท่ากับ', o: ['0.4', '0.6', '0.67', '2.5'], a: 0, why: 'IoU = 40/100 = 0.4 ถ้าเกณฑ์คือ 0.5 กรอบนี้ยังไม่นับว่าถูก' },
{ q: 'AP ของ 3 คลาสคือ 90%, 80%, 70% ค่า mAP เท่ากับ', o: ['70%', '80%', '90%', '240%'], a: 1, why: 'mAP = ค่าเฉลี่ย AP ทุกคลาส = 80%' },
{ q: 'ข้อใดถูกเกี่ยวกับ mAP@0.5:0.95', o: ['ง่ายกว่า mAP@0.5', 'เฉลี่ยที่ IoU 0.50 ถึง 0.95 จึงเข้มงวดกว่า', 'ใช้เฉพาะ classification', 'มีค่าสูงกว่า mAP@0.5 เสมอ'], a: 1, why: 'ต้องแม่นตำแหน่งที่ IoU สูงด้วย ค่าจึงต่ำกว่า mAP@0.5' },
{ q: 'F1 ของ Precision = 0.8 และ Recall = 0.9 มีค่าประมาณ', o: ['0.72', '0.85', '0.90', '1.70'], a: 1, why: '2(0.8)(0.9)/(0.8+0.9) = 1.44/1.7 ≈ 0.847' },
],
},

]);

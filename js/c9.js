/* Chapter 9: Image Classification & CNN */
window.LESSONS = (window.LESSONS || []).concat([

/* ------------------------------------------------------------------ */
{
id: 'classify', ch: 9,
title: 'Image Classification',
sub: 'ให้คอมพิวเตอร์ติดป้ายชื่อคลาสให้ทั้งภาพ: ชนิดของงาน ความท้าทาย framework และ ML กับ Deep Learning',
desc: 'Binary กับ multi-class, 5 ความท้าทาย, framework learning/classification, ML vs DL',
body: `
<p><strong>Image classification</strong> คือกระบวนการที่คอมพิวเตอร์จำแนกประเภทของภาพ โดย<strong>กำหนด label หรือ class ให้กับภาพทั้งภาพ</strong> เช่น ภาพนี้คือ “dog” โดยไม่ต้องบอกว่าหมาอยู่ตรงไหน</p>
<p>โมเดลเรียนจาก <strong>labeled data</strong> คือภาพพร้อมคำตอบ (label) ผ่านขั้น model training แล้วนำไปทำนาย (prediction) ภาพใน test data ที่ไม่เคยเห็น</p>

<h2>สองชนิดของงาน</h2>
<ul>
<li><strong>Binary classification</strong> จำแนกเป็น 2 คลาส เช่น สุนัขหรือแมว, ภาพทางการแพทย์ “ปกติ” หรือ “เป็นมะเร็ง”, สินค้าบนสายพาน “ผ่านมาตรฐาน” หรือ “มีตำหนิ”</li>
<li><strong>Multi-class classification</strong> จำแนกเป็น 3 คลาสขึ้นไป เช่น สุนัข แมว นก ปลา, รถยนต์ รถจักรยานยนต์ รถบัส จักรยาน, ดอกกุหลาบ ทิวลิป ทานตะวัน</li>
</ul>
<p>งานจริงที่ยกในสไลด์: <strong>การแพทย์</strong> วิเคราะห์ภาพ X-ray หาปอดอักเสบ (pneumonia), <strong>การเกษตร</strong> วิเคราะห์โรคพืชจากใบ และ<strong>ความปลอดภัย</strong> ระบบรู้จำใบหน้า</p>

<h2>ความท้าทาย 5 ข้อ</h2>
<p>วัตถุเดียวกันอาจให้ตัวเลขพิกเซลต่างกันโดยสิ้นเชิง โมเดลต้องยังตอบถูก</p>
<div class="fig" data-fig="challenges"></div>
<ul>
<li><strong>Viewpoint variation</strong> มุมมองต่างกัน เช่น รถคันเดียวกันถ่ายด้านข้างกับด้านหน้า</li>
<li><strong>Scale variation</strong> ขนาดในภาพต่างกัน เช่น แมวเต็มเฟรมกับแมวตัวเล็กในภาพ</li>
<li><strong>Illumination</strong> แสงต่างกัน ใบหน้าเดียวกันในที่สว่างกับที่มืด</li>
<li><strong>Background clutter</strong> พื้นหลังรกจนวัตถุกลืนไปกับฉาก เช่น นกบนกิ่งไม้</li>
<li><strong>Intraclass variation</strong> ของในคลาสเดียวกันหน้าตาต่างกันมาก เช่น เก้าอี้ไม้ เก้าอี้สำนักงาน เก้าอี้โซฟา</li>
</ul>

<h2>Framework ของ image classification</h2>
<p>Preprocessing → <strong>Feature extraction</strong> (สี ขอบ รูปร่าง พื้นผิว) → <strong>สร้างแบบจำลอง (model)</strong> → <strong>Classification</strong></p>
<p>ทำงานเป็น 2 ช่วง</p>
<ol>
<li><strong>Learning</strong> สกัด feature จากภาพที่รู้คำตอบ เช่น วัดความสูงกับความกว้างของตัวอักษร “ฟ” และ “ณ” หลายตัว ได้จุดข้อมูลอย่าง (10, 7) และ (6, 9) แล้วให้โมเดลเรียนว่าจะแบ่งสองกลุ่มอย่างไร</li>
<li><strong>Classification</strong> ภาพใหม่ผ่านการสกัด feature แบบเดิม แล้วส่งให้โมเดลบอกว่าเป็นคลาสไหน</li>
</ol>

<h2>Traditional ML กับ Deep Learning</h2>
<div class="fig" data-fig="mlvsdl"></div>
<div class="tbl-wrap"><table class="tbl">
<tr><th></th><th>Traditional Machine Learning</th><th>Deep Learning</th></tr>
<tr><td>Feature</td><td>คนออกแบบเอง (feature engineering / handcrafted) เช่น HOG</td><td>โมเดลเรียนรู้ feature เองอัตโนมัติ (feature learning + classification ในตัวเดียว)</td></tr>
<tr><td>ข้อดี</td><td>ใช้ dataset ขนาดเล็กได้ เร็ว ใช้ทรัพยากรน้อย</td><td>ดึง feature อัตโนมัติ ความแม่นยำสูง</td></tr>
<tr><td>ข้อเสีย</td><td>ต้องเลือก feature เอง ไม่ยืดหยุ่น ปรับใช้กับปัญหาซับซ้อนสูงได้ยาก</td><td>ต้องใช้ dataset ขนาดใหญ่ และ GPU ประสิทธิภาพสูง</td></tr>
<tr><td>ตัวอย่าง</td><td>HOG + SVM จำแนกรถยนต์กับคน</td><td>CNN, Transfer learning (AlexNet, ResNet, VGG, EfficientNet, MobileNet)</td></tr>
</table></div>
`,
written: [
{ q: 'Image Classification คืออะไร Binary classification ต่างจาก Multi-class classification อย่างไร จงยกตัวอย่างประกอบ', a: `
<p>Image classification คือกระบวนการที่คอมพิวเตอร์จำแนกประเภทของภาพ โดยกำหนด label หรือ class ให้กับภาพทั้งภาพ</p>
<ul><li><strong>Binary</strong> มีคำตอบได้ 2 คลาส เช่น สุนัข/แมว, ภาพการแพทย์ปกติ/เป็นมะเร็ง, สินค้าผ่านมาตรฐาน/มีตำหนิ</li>
<li><strong>Multi-class</strong> มีคำตอบตั้งแต่ 3 คลาสขึ้นไป เลือกได้คลาสเดียว เช่น สุนัข/แมว/นก/ปลา, รถยนต์/จักรยานยนต์/รถบัส/จักรยาน, ดอกกุหลาบ/ทิวลิป/ทานตะวัน</li></ul>
<p>Binary มักใช้ sigmoid ที่ output ส่วน multi-class ใช้ softmax</p>` },
{ q: 'จงอธิบายความท้าทายของ Image Classification อย่างน้อย 4 ข้อ พร้อมยกตัวอย่าง', a: `
<ul><li><strong>Viewpoint variation</strong> วัตถุเดียวกันถ่ายจากมุมต่างกันได้ภาพต่างกันมาก เช่น รถด้านข้างกับด้านหน้า</li>
<li><strong>Scale variation</strong> ขนาดของวัตถุในภาพต่างกัน เช่น แมวเต็มเฟรมกับแมวตัวเล็กไกล ๆ</li>
<li><strong>Illumination</strong> สภาพแสงต่างกัน เช่น ใบหน้าในที่สว่างกับในที่มืด</li>
<li><strong>Background clutter</strong> พื้นหลังรกหรือสีกลืนกับวัตถุ เช่น นกเกาะกิ่งไม้ในพุ่มไม้</li>
<li><strong>Intraclass variation</strong> วัตถุคลาสเดียวกันมีหน้าตาหลากหลาย เช่น เก้าอี้หลายแบบ</li></ul>
<p>สิ่งเหล่านี้ทำให้ค่าพิกเซลเปลี่ยนไปมากแม้เป็นวัตถุเดิม โมเดลจึงต้องเรียนจากข้อมูลที่หลากหลาย และใช้ feature ที่ทนต่อการเปลี่ยนแปลง</p>` },
{ q: 'จงอธิบาย framework ของ Image Classification และความแตกต่างระหว่างช่วง Learning กับช่วง Classification', a: `
<p>ขั้นตอนหลักคือ Preprocessing → Feature extraction (สี ขอบ รูปร่าง พื้นผิว) → สร้างแบบจำลอง (model) → Classification</p>
<ul><li><strong>Learning</strong> ใช้ภาพที่รู้ label แล้ว สกัด feature ออกมาเป็นเวกเตอร์ เช่น ความสูงและความกว้างของตัวอักษร แล้วให้โมเดลเรียนรู้ความสัมพันธ์ระหว่าง feature กับคลาส ได้เป็น model</li>
<li><strong>Classification</strong> นำภาพใหม่ที่ไม่รู้คำตอบ ผ่าน preprocessing และ feature extraction แบบเดียวกัน แล้วให้ model ที่เรียนแล้วทำนายคลาส</li></ul>` },
{ q: 'จงเปรียบเทียบ Traditional Machine Learning กับ Deep Learning สำหรับงานจำแนกภาพ ในด้านการได้มาของ feature ข้อดี ข้อเสีย และตัวอย่าง', tag: 'เปรียบเทียบ', a: `
<p><strong>Traditional ML</strong> คนต้องออกแบบและเลือก feature เอง (feature engineering) เช่น HOG แล้วส่งให้โมเดลอย่าง SVM จำแนก ข้อดีคือใช้ dataset เล็กได้ เร็ว ใช้ทรัพยากรน้อย ข้อเสียคือต้องเลือก feature เอง ไม่ยืดหยุ่น ใช้กับปัญหาซับซ้อนสูงได้ยาก ตัวอย่าง HOG + SVM แยกรถยนต์กับคน</p>
<p><strong>Deep Learning</strong> โมเดลเรียนรู้ feature เองอัตโนมัติจากภาพดิบ โดยรวม feature learning กับ classification ไว้ในโมเดลเดียว ข้อดีคือดึง feature อัตโนมัติและแม่นยำสูง ข้อเสียคือต้องใช้ dataset ขนาดใหญ่และ GPU ประสิทธิภาพสูง ตัวอย่าง CNN และ transfer learning เช่น AlexNet, ResNet, VGG, EfficientNet, MobileNet</p>` },
{ q: 'ถ้ามีภาพสินค้าที่ติดป้ายไว้เพียง 200 ภาพ และมีเพียงคอมพิวเตอร์ไม่มี GPU ควรเลือกแนวทางใด เพราะอะไร และถ้าอยากใช้ CNN จะทำอย่างไร', tag: 'คิดวิเคราะห์', a: `
<p>ควรเลือก traditional ML เช่น สกัด HOG, color histogram หรือ texture แล้วใช้ SVM เพราะใช้ข้อมูลน้อยได้ เร็ว และไม่ต้องใช้ GPU ส่วนการเทรน CNN ตั้งแต่ศูนย์ต้องใช้ข้อมูลมากและ GPU มิฉะนั้นจะ overfit และช้า</p>
<p>ถ้าอยากใช้ CNN ให้ใช้ <strong>transfer learning</strong> คือนำโมเดลที่เทรนกับข้อมูลขนาดใหญ่มาแล้ว (เช่น MobileNet ที่เทรนกับ ImageNet) มาเปลี่ยนชั้น output ให้ตรงกับคลาสของเรา แล้วเทรนต่อเล็กน้อย ช่วยให้ใช้ข้อมูลน้อยได้</p>` },
{ q: 'จงยกตัวอย่างการประยุกต์ใช้ image classification ในงานจริงอย่างน้อย 3 ด้าน', a: `
<ul><li><strong>การแพทย์</strong> วิเคราะห์ภาพ X-ray ว่าปอดปกติหรือมีปอดอักเสบ</li>
<li><strong>การเกษตร</strong> วิเคราะห์โรคพืชจากภาพใบ</li>
<li><strong>ความปลอดภัย</strong> ระบบรู้จำใบหน้า</li>
<li><strong>อุตสาหกรรม</strong> ตรวจสินค้าบนสายพานว่าผ่านมาตรฐานหรือมีตำหนิ</li></ul>` },
],
mcq: [
{ q: 'จำแนกภาพรถเป็น รถยนต์ / จักรยานยนต์ / รถบัส / จักรยาน เป็นงานแบบใด', o: ['Binary classification', 'Multi-class classification', 'Object detection', 'Segmentation'], a: 1, why: 'มีมากกว่า 2 คลาสและให้คำตอบคลาสเดียวต่อภาพ' },
{ q: 'ภาพเก้าอี้ไม้ เก้าอี้สำนักงาน และโซฟา อยู่ในคลาส “เก้าอี้” เหมือนกัน เป็นความท้าทายข้อใด', o: ['Viewpoint variation', 'Scale variation', 'Intraclass variation', 'Background clutter'], a: 2, why: 'ของในคลาสเดียวกันหน้าตาต่างกันมาก' },
{ q: 'นกสีน้ำตาลเกาะกิ่งไม้ในพุ่มไม้รก ๆ เป็นความท้าทายข้อใด', o: ['Illumination', 'Background clutter', 'Scale variation', 'Viewpoint variation'], a: 1, why: 'พื้นหลังรกและกลืนกับวัตถุ' },
{ q: 'ข้อใดเป็นข้อเสียของ Deep Learning ตามสไลด์', o: ['ต้องเลือก feature เอง', 'ใช้กับปัญหาซับซ้อนไม่ได้', 'ต้องใช้ dataset ใหญ่และ GPU สูง', 'แม่นยำต่ำ'], a: 2, why: 'DL ดึง feature เองและแม่นยำสูง แต่ต้องการข้อมูลมากและ GPU' },
{ q: 'HOG + SVM เป็นตัวอย่างของแนวทางใด', o: ['Deep learning', 'Traditional machine learning', 'Transfer learning', 'Unsupervised clustering'], a: 1, why: 'HOG คือ feature ที่คนออกแบบ (handcrafted) และ SVM คือโมเดล ML แบบดั้งเดิม' },
{ q: 'ข้อใดไม่ใช่โมเดลที่ใช้ทำ transfer learning ในสไลด์', o: ['ResNet', 'MobileNet', 'EfficientNet', 'Canny'], a: 3, why: 'Canny เป็นวิธีหาขอบ ไม่ใช่โมเดลโครงข่ายประสาทเทียม' },
],
},

/* ------------------------------------------------------------------ */
{
id: 'cnn', ch: 9,
title: 'Convolutional Neural Networks',
sub: 'โครงสร้าง CNN และสิ่งที่เกิดขึ้นใน convolutional layer: filter, stride, padding และ feature map',
desc: 'แนวคิด CNN, สถาปัตยกรรม, convolution, stride, padding, ขนาด output, ภาพ RGB',
body: `
<p><strong>CNN (Convolutional Neural Network)</strong> ได้แรงบันดาลใจจาก<strong>ระบบการมองเห็นของมนุษย์</strong> โดยเรียนรู้ลักษณะเด่น (features) ของภาพ<strong>เป็นลำดับชั้น</strong> ตั้งแต่ลักษณะง่าย ๆ อย่างเส้นขอบ มุม สี ไปจนถึงลักษณะซับซ้อนอย่างตา หู ล้อรถ</p>
<p>ปี 1995 <strong>Yann LeCun และ Yoshua Bengio</strong> นำเสนอ CNN ซึ่งเป็นโครงข่ายประสาทเทียมที่ออกแบบมาเฉพาะสำหรับข้อมูลที่มีโครงสร้างแบบตาราง เช่น ภาพ โดยใช้การดำเนินการ <strong>convolution</strong> เป็นหลัก CNN เป็นเครือข่ายระดับลึก จึงจัดเป็น deep learning โมเดลเรียนรู้น้ำหนัก (weights) ของ filter เองเพื่อแยกประเภทของภาพ</p>

<h2>สถาปัตยกรรม CNN</h2>
<div class="fig" data-fig="cnnarch"></div>
<p>ครึ่งแรกเป็นส่วน <strong>feature extraction</strong> (convolution + activation + pooling ซ้ำหลายรอบ) ครึ่งหลังเป็นส่วน <strong>classification</strong> (flatten + fully connected + softmax) ที่ให้ผลเป็นความน่าจะเป็นของแต่ละคลาส</p>

<h2>Convolutional layer</h2>
<p>ใน convolutional layer มี <strong>filter (kernel)</strong> ที่เลื่อนไปทั่วภาพเพื่อตรวจจับบริเวณที่มีคุณสมบัติเดียวกัน ณ ตำแหน่งต่าง ๆ ในภาพ filter เดียวใช้น้ำหนักชุดเดียวกันทั้งภาพ ลวดลายเดียวกันจึงถูกตรวจเจอไม่ว่าจะอยู่ตรงไหน</p>
<p>ที่แต่ละตำแหน่งคำนวณ <strong>dot product</strong> คือคูณค่าที่ซ้อนกันทีละช่องแล้วรวมกัน ได้ 1 ค่าใน <strong>feature map</strong></p>
<div class="fig" data-fig="conv"></div>
<p>Filter 1 มีค่า 1 ตามแนวทแยง จึงให้ค่าสูงสุด (3) ตรงที่ภาพมีเส้นทแยงพอดี Filter 2 มีค่า 1 ตามแนวตั้ง จึงตอบสนองต่อเส้นแนวตั้ง แต่ละ filter จึงเป็นตัวตรวจจับลวดลายหนึ่งแบบ</p>

<h3>พารามิเตอร์สำคัญ</h3>
<ol>
<li><strong>Filter size</strong> ขนาดของ kernel เช่น 3×3, 5×5</li>
<li><strong>Number of filters</strong> จำนวน filter เท่ากับจำนวน feature map ที่ได้ เช่น 2 filters บนภาพ 6×6 ได้ 2×4×4</li>
<li><strong>Stride</strong> ระยะการเลื่อน kernel แต่ละครั้ง stride ใหญ่ขึ้น output เล็กลง</li>
<li><strong>Padding</strong> การเพิ่มขอบ (มักเป็น 0) รอบภาพ เพื่อคงขนาด output และให้พิกเซลขอบภาพถูกใช้ครบ</li>
<li><strong>Activation function</strong> ฟังก์ชันที่ใส่ต่อจากผล convolution</li>
</ol>
<div class="eq"><span class="m">O = (N − F + 2P) / S + 1</span></div>
<dl class="sym"><dt>N</dt><dd>ขนาดภาพ input (ด้านเดียว)</dd><dt>F</dt><dd>ขนาด filter</dd><dt>P</dt><dd>padding แต่ละด้าน</dd><dt>S</dt><dd>stride</dd><dt>O</dt><dd>ขนาด feature map (ปัดลงถ้าไม่ลงตัว)</dd></dl>
<p>ภาพ 6×6 กับ filter 3×3 ไม่มี padding: stride 1 ได้ (6−3)/1+1 = 4 คือ 4×4 ส่วน stride 2 ได้ ⌊3/2⌋+1 = 2 คือ 2×2</p>

<h3>ภาพสี RGB</h3>
<p>ภาพสีมี 3 channel filter จึงต้องมีความลึก 3 ด้วย (เช่น 3×3×3) คำนวณ dot product ทุก channel แล้วรวมเป็นค่าเดียว filter หนึ่งตัวจึงยังให้ feature map 1 แผ่น</p>
`,
written: [
{ q: 'CNN คืออะไร มีแนวคิดมาจากอะไร และต่างจากการใช้ feature ที่คนออกแบบเองอย่างไร', a: `
<p>CNN (Convolutional Neural Network) คือโครงข่ายประสาทเทียมระดับลึก (deep learning) ที่ออกแบบมาสำหรับข้อมูลแบบตารางเช่นภาพ ใช้การดำเนินการ convolution เป็นหลัก นำเสนอโดย Yann LeCun และ Yoshua Bengio ในปี 1995</p>
<p>แนวคิดมาจากระบบการมองเห็นของมนุษย์ ที่เรียนรู้ลักษณะเด่นเป็นลำดับชั้น จากง่าย (ขอบ มุม สี) ไปซับซ้อน (ตา หู ล้อรถ)</p>
<p>ต่างจาก handcrafted feature เช่น HOG ตรงที่ค่าใน filter ของ CNN ไม่ได้ถูกกำหนดโดยคน แต่โมเดลเรียนรู้น้ำหนักเองจากข้อมูลระหว่างการเทรน</p>` },
{ q: 'จงอธิบายสถาปัตยกรรมของ CNN ตั้งแต่ input จนถึง output และหน้าที่ของแต่ละชั้น', a: `
<ol><li><strong>Input</strong> ภาพเป็นตารางตัวเลข (เช่น สูง×กว้าง×3 channel)</li>
<li><strong>Convolutional layer + Activation (ReLU)</strong> ใช้ filter สกัด feature ได้ feature maps แล้วใส่ความไม่เชิงเส้น</li>
<li><strong>Pooling layer</strong> ลดขนาด feature map เช่น max pooling ลดพารามิเตอร์และการคำนวณ</li>
<li>ทำซ้ำ convolution และ pooling หลายรอบ ได้ feature ที่ซับซ้อนขึ้นเรื่อย ๆ (ส่วน feature extraction)</li>
<li><strong>Flatten layer</strong> แปลง feature map หลายมิติเป็นเวกเตอร์ 1 มิติ</li>
<li><strong>Fully connected layer</strong> นิวรอนเชื่อมกับทุกนิวรอนชั้นก่อน เรียนรู้ weights และ bias เพื่อจำแนก (ส่วน classification)</li>
<li><strong>Output</strong> ใช้ softmax (หลายคลาส) หรือ sigmoid (2 คลาส) ให้ความน่าจะเป็นของแต่ละคลาส</li></ol>` },
{ q: 'Convolutional layer ทำงานอย่างไร และมีพารามิเตอร์สำคัญอะไรบ้าง', a: `
<p>Convolutional layer มี filter (kernel) ขนาดเล็กที่เลื่อนไปทั่วภาพ ทุกตำแหน่งคำนวณ dot product ระหว่าง filter กับบริเวณภาพที่ซ้อนอยู่ (คูณทีละช่องแล้วรวม) ได้ค่า 1 ค่า เมื่อเลื่อนครบได้ feature map ที่บอกว่าลวดลายของ filter ปรากฏตรงไหนในภาพ filter ใช้น้ำหนักเดียวกันทุกตำแหน่ง จึงตรวจเจอลวดลายเดียวกันได้ทุกที่</p>
<p>พารามิเตอร์สำคัญ</p>
<ol><li>Filter size เช่น 3×3, 5×5</li><li>Number of filters = จำนวน feature map ที่ได้</li><li>Stride ระยะการเลื่อน kernel</li><li>Padding การเพิ่มขอบรอบภาพ</li><li>Activation function เช่น ReLU</li></ol>` },
{ q: 'Stride และ Padding คืออะไร มีผลต่อขนาดของ feature map อย่างไร จงแสดงด้วยตัวอย่าง', a: `
<p><strong>Stride</strong> คือจำนวนช่องที่ filter เลื่อนแต่ละครั้ง ยิ่ง stride มาก output ยิ่งเล็ก <strong>Padding</strong> คือการเติมขอบ (มักเป็นศูนย์) รอบภาพ ทำให้ output ไม่หดและพิกเซลขอบถูกใช้ครบ</p>
<p>ขนาด output O = (N − F + 2P)/S + 1</p>
<ul><li>ภาพ 6×6, filter 3×3, P = 0, S = 1 → (6−3)/1+1 = 4 ได้ 4×4</li>
<li>S = 2 → ⌊(6−3)/2⌋+1 = 2 ได้ 2×2</li>
<li>P = 1, S = 1 → (6−3+2)/1+1 = 6 ได้ 6×6 เท่าเดิม (same padding)</li></ul>` },
{ q: 'ถ้าภาพ input เป็นภาพสี RGB filter และ feature map จะเป็นอย่างไร', a: `
<p>ภาพสีมี 3 channel (R, G, B) filter แต่ละตัวต้องมีความลึกเท่ากับจำนวน channel ของ input เช่น 3×3×3 การคำนวณจะทำ dot product ในแต่ละ channel แล้วรวมผลทั้ง 3 channel เป็นค่าเดียว ดังนั้น filter หนึ่งตัวยังคงให้ feature map 1 แผ่น ถ้ามี 2 filters ก็ได้ feature map 2 แผ่นเหมือนเดิม</p>` },
{ q: 'ทำไม CNN จึงเรียนรู้ feature ได้เป็นลำดับชั้น ชั้นต้นกับชั้นลึกเรียนรู้อะไรต่างกัน', tag: 'คิดวิเคราะห์', a: `
<p>เพราะ CNN วาง convolutional layer ซ้อนกันหลายชั้น ชั้นแรกเห็นภาพเฉพาะบริเวณเล็ก ๆ จึงเรียนรู้ลักษณะง่าย ๆ เช่น ขอบ มุม สี ชั้นถัดไปรับ feature map ของชั้นก่อน (บวกกับ pooling ที่ทำให้แต่ละค่าครอบคลุมบริเวณกว้างขึ้น) จึงรวมลักษณะง่ายเป็นลักษณะซับซ้อน เช่น ลวดลาย รูปทรง และชั้นลึกเรียนรู้ส่วนของวัตถุ เช่น ตา หู ล้อรถ ซึ่งคล้ายการมองเห็นของมนุษย์</p>` },
],
mcq: [
{ q: 'ภาพ 6×6 กับ filter 3×3 stride 1 ไม่มี padding ได้ feature map ขนาดเท่าใด', o: ['3×3', '4×4', '5×5', '6×6'], a: 1, why: '(6 − 3)/1 + 1 = 4' },
{ q: 'ภาพ 6×6 กับ filter 3×3 stride 2 ไม่มี padding ได้ feature map ขนาดเท่าใด', o: ['2×2', '3×3', '4×4', '1×1'], a: 0, why: '⌊(6 − 3)/2⌋ + 1 = 2' },
{ q: 'Convolutional layer ที่มี 2 filters บนภาพ 6×6 (filter 3×3, stride 1) ได้ output ขนาดเท่าใด', o: ['4×4', '2×4×4', '2×6×6', '8×8'], a: 1, why: 'แต่ละ filter ให้ 4×4 หนึ่งแผ่น 2 filters จึงได้ 2×4×4' },
{ q: 'การคำนวณที่แต่ละตำแหน่งของ convolution คือ', o: ['หาค่ามากสุด', 'dot product: คูณทีละช่องแล้วรวม', 'หาค่าเฉลี่ย', 'นับจำนวนช่องที่ไม่เป็นศูนย์'], a: 1, why: 'Convolution ใช้ dot product ของ filter กับบริเวณภาพ ส่วนหาค่ามากสุดคือ max pooling' },
{ q: 'Padding ใช้ทำอะไร', o: ['ลดจำนวน filter', 'เพิ่ม border รอบภาพ เพื่อคงขนาดและใช้พิกเซลขอบ', 'เพิ่มความไม่เชิงเส้น', 'แปลงเป็นเวกเตอร์ 1 มิติ'], a: 1, why: 'สไลด์นิยาม padding ว่าการเพิ่ม border รอบภาพ' },
{ q: 'ภาพ RGB ใช้ filter ขนาด 3×3 จะต้องมีจำนวนน้ำหนักใน filter หนึ่งตัวเท่าใด (ไม่นับ bias)', o: ['9', '18', '27', '81'], a: 2, why: 'filter ต้องลึกเท่าจำนวน channel: 3×3×3 = 27' },
{ q: 'ใครเป็นผู้นำเสนอ CNN ในปี 1995 ตามสไลด์', o: ['Geoffrey Hinton และ Andrew Ng', 'Yann LeCun และ Yoshua Bengio', 'Dalal และ Triggs', 'Paul Hough'], a: 1, why: 'สไลด์ระบุ Yann LeCun และ Yoshua Bengio' },
],
},

/* ------------------------------------------------------------------ */
{
id: 'layers', ch: 9,
title: 'Activation, Pooling & Output',
sub: 'สิ่งที่เกิดหลัง convolution: activation function ทั้ง 4 ตัว, pooling, flatten และ fully connected',
desc: 'ReLU, sigmoid + threshold, tanh, softmax, max pooling, flatten, FC layer',
body: `
<h2>Activation function</h2>
<p>คือฟังก์ชันทางคณิตศาสตร์ที่อยู่ใน convolution layer หรือ fully connected layer เพื่อ<strong>เพิ่มความไม่เชิงเส้น (non-linearity)</strong> ให้โมเดล ทำให้เครือข่ายเรียนรู้ลักษณะที่ซับซ้อนในภาพได้ เช่น ขอบ รูปทรง ลวดลาย และเลือกว่าจะ “ตัดทิ้ง” หรือ “เก็บ” feature ไหน</p>
<p>ถ้าไม่มี activation การซ้อนหลายชั้นก็ยังเท่ากับฟังก์ชันเชิงเส้นชั้นเดียว ความลึกจะไม่มีประโยชน์</p>
<div class="fig" data-fig="activation"></div>
<div class="tbl-wrap"><table class="tbl">
<tr><th>ฟังก์ชัน</th><th>สูตร</th><th>ช่วงผลลัพธ์</th><th>ใช้ที่ไหน</th></tr>
<tr><td>ReLU</td><td class="mono">max(0, z)</td><td>0 ถึง ∞</td><td>ชั้น hidden / หลัง convolution นิยมที่สุด</td></tr>
<tr><td>Sigmoid</td><td class="mono">1 / (1 + e<sup>−z</sup>)</td><td>(0, 1)</td><td>output ของ binary classification</td></tr>
<tr><td>Tanh</td><td class="mono">(e<sup>z</sup> − e<sup>−z</sup>) / (e<sup>z</sup> + e<sup>−z</sup>)</td><td>[−1, 1]</td><td>ชั้น hidden ที่อยากให้มีค่าลบได้ สมมาตรรอบ 0</td></tr>
<tr><td>Softmax</td><td class="mono">e<sup>zᵢ</sup> / Σⱼ e<sup>zⱼ</sup></td><td>[0, 1] รวมกัน = 1</td><td>output ของ multi-class classification</td></tr>
</table></div>
<p><strong>ReLU</strong> แปลงค่าให้เป็น 0 หรือมากกว่า: ถ้า z ≤ 0 ได้ 0 ถ้า z > 0 ได้ z เดิม เมื่อใส่กับ feature map ของ filter 1 ค่าลบทั้งหมดกลายเป็น 0 เหลือแค่ตำแหน่งที่ตรงกับลวดลาย</p>

<h3>Sigmoid และ threshold</h3>
<p>ผลของ sigmoid เป็นความน่าจะเป็นของคลาส 1 จึงต้องเลือก threshold เพื่อตัดสิน เช่น หมา = class 1 แมว = class 0</p>
<ul>
<li>z = 2.0 → f(2) = 1/(1 + e<sup>−2</sup>) = 1/1.1353 ≈ 0.8808 ≥ 0.5 → <strong>หมา</strong></li>
<li>z = −1.5 → f(−1.5) = 1/(1 + 4.481) ≈ 0.182 < 0.5 → <strong>แมว</strong></li>
<li>f(z) = 0.45: threshold 0.5 → แมว, threshold 0.3 → หมา, threshold 0.7 → แมว ผลลัพธ์เดียวกันให้คำตอบต่างกันตาม threshold</li>
</ul>

<h3>Softmax</h3>
<p>ใช้ใน output layer ให้ผลเป็น probability distribution ทุกค่าอยู่ใน [0, 1] และ<strong>รวมกันเท่ากับ 1</strong> เหมาะกับ multi-class</p>
<div class="fig" data-fig="softmax"></div>

<h2>Pooling layer</h2>
<p>ทำหน้าที่<strong>ลดขนาดของ feature map</strong> (subsampling / downsampling) ภาพเล็กลงโดยวัตถุในภาพไม่เปลี่ยน ทำให้<strong>จำนวนพารามิเตอร์และการคำนวณลดลง</strong> และทนต่อการเลื่อนเล็กน้อยของวัตถุ</p>
<p><strong>Max pooling</strong> แบ่ง feature map เป็นช่อง เช่น 2×2 แล้วเก็บเฉพาะค่ามากที่สุดของแต่ละช่อง (ส่วน average pooling ใช้ค่าเฉลี่ย)</p>
<div class="fig" data-fig="pool"></div>

<h2>Flatten layer</h2>
<p>แปลงข้อมูลหลายมิติ เช่น feature map 2D/3D จาก convolution และ pooling ให้เป็น<strong>เวกเตอร์ 1 มิติ</strong> โดยเรียงทุกค่ามาต่อกัน เพื่อส่งเข้า fully connected layer เช่น 7×7×64 → 3136 และ 2×2×2 → 8</p>

<h2>Fully connected layer</h2>
<p>ชั้นที่ neuron แต่ละตัว<strong>เชื่อมต่อกับ neuron ทุกตัวในชั้นก่อนหน้า</strong> และเรียนรู้ weights กับ bias เพื่อทำการจำแนก</p>
<ol>
<li><strong>Input</strong> รับเวกเตอร์ 1 มิติจาก flatten</li>
<li><strong>Weighted sum</strong> แต่ละนิวรอนคำนวณ z = Σ wᵢxᵢ + b</li>
<li><strong>Activation</strong> นำ z ผ่าน sigmoid (binary) หรือ softmax (multi-class)</li>
<li><strong>Output</strong> ได้ผลเป็น class</li>
</ol>
<div class="eq"><span class="m">z = Σ wᵢ xᵢ + b</span></div>
<dl class="sym"><dt>xᵢ</dt><dd>input แต่ละตัวจาก flatten</dd><dt>wᵢ</dt><dd>weight ของการเชื่อมแต่ละเส้น (เรียนรู้ได้)</dd><dt>b</dt><dd>bias (เรียนรู้ได้)</dd><dt>z</dt><dd>ค่าก่อนเข้า activation</dd></dl>
`,
written: [
{ q: 'Activation function คืออะไร มีหน้าที่อะไรใน CNN และถ้าไม่มี activation จะเกิดอะไรขึ้น', a: `
<p>Activation function คือฟังก์ชันทางคณิตศาสตร์ที่อยู่ใน convolution layer หรือ fully connected layer ทำหน้าที่เพิ่มความไม่เชิงเส้น (non-linearity) ให้โมเดล ทำให้เครือข่ายเรียนรู้ลักษณะที่ซับซ้อนในภาพได้ เช่น ขอบ รูปทรง ลวดลาย และทำหน้าที่เลือกตัดทิ้งหรือเก็บเฉพาะ feature ที่สำคัญ</p>
<p>ถ้าไม่มี activation การคำนวณทุกชั้นเป็นการคูณและบวกเชิงเส้น ซ้อนกันกี่ชั้นก็รวมได้เป็นฟังก์ชันเชิงเส้นชั้นเดียว โมเดลจึงเรียนได้แค่เส้นแบ่งตรง ๆ แก้ปัญหาซับซ้อนไม่ได้</p>` },
{ q: 'จงเปรียบเทียบ activation function ReLU, Sigmoid, Tanh และ Softmax ในด้านช่วงของผลลัพธ์และการนำไปใช้', tag: 'เปรียบเทียบ', a: `
<ul><li><strong>ReLU</strong> f(z) = max(0, z) ค่าลบเป็น 0 ค่าบวกเท่าเดิม ช่วง [0, ∞) นิยมใช้หลัง convolution และใน hidden layer เพราะคำนวณง่าย</li>
<li><strong>Sigmoid</strong> f(z) = 1/(1+e<sup>−z</sup>) ช่วง (0, 1) ตีความเป็นความน่าจะเป็น ใช้ใน output ของ binary classification</li>
<li><strong>Tanh</strong> ช่วง [−1, 1] สมมาตรรอบศูนย์ ให้ค่าลบได้</li>
<li><strong>Softmax</strong> f(zᵢ) = e<sup>zᵢ</sup>/Σe<sup>zⱼ</sup> แต่ละค่าอยู่ใน [0, 1] และรวมกันได้ 1 ใช้ใน output ของ multi-class classification</li></ul>` },
{ q: 'ในงานจำแนกหมา (class 1) กับแมว (class 0) ด้วย sigmoid ค่า threshold มีผลต่อการทำนายอย่างไร จงยกตัวอย่าง', a: `
<p>Sigmoid ให้ค่าความน่าจะเป็นที่ภาพเป็น class 1 ต้องเทียบกับ threshold: ถ้า f(z) ≥ threshold ทำนายเป็นหมา ถ้าน้อยกว่าทำนายเป็นแมว</p>
<p>ตัวอย่าง f(z) = 0.45</p>
<ul><li>threshold 0.5 → 0.45 < 0.5 ทำนายว่าแมว</li><li>threshold 0.3 → 0.45 ≥ 0.3 ทำนายว่าหมา</li><li>threshold 0.7 → 0.45 < 0.7 ทำนายว่าแมว</li></ul>
<p>threshold ต่ำทำให้ทายเป็น class 1 ง่ายขึ้น (recall ของ class 1 สูงขึ้น แต่ทายผิดมากขึ้น) threshold สูงทำให้ทาย class 1 เฉพาะเมื่อมั่นใจมาก</p>` },
{ q: 'Softmax คืออะไร มีคุณสมบัติอย่างไร และโมเดลเลือกคำตอบจากผลของ softmax อย่างไร', a: `
<p>Softmax เป็น activation ที่ใช้ใน output layer แปลงค่า z ของแต่ละคลาสเป็นความน่าจะเป็นด้วย f(zᵢ) = e<sup>zᵢ</sup>/Σⱼe<sup>zⱼ</sup></p>
<ul><li>ผลเป็น probability distribution</li><li>ทุกค่าอยู่ในช่วง [0, 1]</li><li>ผลรวมทุกคลาสเท่ากับ 1</li><li>เหมาะกับ multi-class classification</li></ul>
<p>โมเดลเลือกคลาสที่มีความน่าจะเป็นสูงสุด เช่น z = [2.0, 1.0, 0.1] ได้ [0.659, 0.242, 0.099] สำหรับ แมว หมา หนู จึงตอบว่าแมว (65.9%)</p>` },
{ q: 'Pooling layer มีหน้าที่อะไร Max pooling ทำงานอย่างไร และมีประโยชน์อย่างไร', a: `
<p>Pooling layer ลดขนาดของ feature map (subsampling/downsampling) โดยวัตถุในภาพไม่เปลี่ยนแปลง</p>
<p><strong>Max pooling</strong> แบ่ง feature map เป็นหน้าต่าง เช่น 2×2 (stride 2) แล้วเลือกค่ามากที่สุดของแต่ละหน้าต่างเป็น output feature map 4×4 จึงเหลือ 2×2</p>
<p>ประโยชน์: ลดจำนวนพารามิเตอร์และปริมาณการคำนวณ ลดโอกาส overfit เก็บเฉพาะสัญญาณที่แรงที่สุด และทำให้ทนต่อการเลื่อนตำแหน่งเล็กน้อยของวัตถุ</p>` },
{ q: 'Flatten layer และ Fully connected layer ทำหน้าที่อะไร จงอธิบายขั้นตอนการทำงานของ fully connected layer', a: `
<p><strong>Flatten</strong> แปลง feature map หลายมิติเป็นเวกเตอร์ 1 มิติ โดยเรียงทุกค่าต่อกัน เช่น 7×7×64 เป็น 3136 เพื่อส่งเข้า fully connected</p>
<p><strong>Fully connected</strong> คือชั้นที่ neuron แต่ละตัวเชื่อมกับ neuron ทุกตัวในชั้นก่อนหน้า เรียนรู้ weights และ bias เพื่อจำแนกประเภท</p>
<ol><li>Input: รับเวกเตอร์ 1 มิติจาก flatten</li><li>Weighted sum: z = Σwᵢxᵢ + b</li><li>Activation: sigmoid สำหรับ binary หรือ softmax สำหรับ multi-class</li><li>Output: ได้ผลเป็นคลาส</li></ol>` },
{ q: 'ทำไมจึงนิยมใช้ ReLU หลัง convolution จงอธิบายผลของ ReLU ต่อ feature map', tag: 'คิดวิเคราะห์', a: `
<p>ReLU คำนวณง่ายมาก (แค่ตัดค่าลบเป็น 0) ทำให้เทรนเร็ว และไม่ทำให้ gradient เล็กลงมากเหมือน sigmoid หรือ tanh เมื่อค่า z มีขนาดใหญ่</p>
<p>ผลต่อ feature map: ตำแหน่งที่ dot product เป็นลบ (บริเวณที่ไม่ตรงกับลวดลายของ filter) จะกลายเป็น 0 เหลือเฉพาะตำแหน่งที่ตอบสนองเชิงบวก เช่น feature map ของ filter 1 [3, −1, −3, −1, …] กลายเป็น [3, 0, 0, 0, …] จึงเป็นการ “เก็บ” feature ที่สำคัญและ “ตัดทิ้ง” ส่วนที่ไม่เกี่ยว</p>` },
],
mcq: [
{ q: 'ReLU(−3) และ ReLU(3) มีค่าเท่าใด', o: ['0 และ 3', '−3 และ 3', '0 และ 1', '0.05 และ 0.95'], a: 0, why: 'ReLU: z ≤ 0 ได้ 0, z > 0 ได้ z เดิม' },
{ q: 'Activation ใดให้ผลในช่วง [−1, 1]', o: ['ReLU', 'Sigmoid', 'Tanh', 'Softmax'], a: 2, why: 'Tanh ให้ค่าระหว่าง −1 ถึง 1 ส่วน sigmoid อยู่ระหว่าง 0 ถึง 1' },
{ q: 'ใช้ sigmoid ได้ f(z) = 0.45 threshold = 0.3 (หมา = class 1) จะทำนายว่า', o: ['หมา', 'แมว', 'ไม่แน่ใจ', 'ต้องใช้ softmax'], a: 0, why: '0.45 ≥ 0.3 จึงเป็น class 1 คือหมา' },
{ q: 'ข้อใดเป็นคุณสมบัติของ softmax', o: ['ผลรวมทุกคลาสเท่ากับ 1', 'ให้ค่าลบได้', 'ใช้เฉพาะชั้น convolution', 'ให้คำตอบได้หลายคลาสพร้อมกันเสมอ'], a: 0, why: 'Softmax ให้ probability distribution ทุกค่าใน [0,1] และรวมเป็น 1' },
{ q: 'Max pooling 2×2 stride 2 กับบล็อก [3, 0; 0, 1] ได้ค่าใด', o: ['1', '3', '4', '1.0 (ค่าเฉลี่ย)'], a: 1, why: 'Max pooling เลือกค่ามากที่สุดของบล็อก คือ 3' },
{ q: 'Flatten feature map ขนาด 7×7×64 จะได้เวกเตอร์ความยาวเท่าใด', o: ['448', '3136', '4096', '64'], a: 1, why: '7 × 7 × 64 = 3136' },
{ q: 'Pooling layer ไม่ได้ทำสิ่งใด', o: ['ลดขนาด feature map', 'ลดจำนวนพารามิเตอร์', 'เรียนรู้ weights ของ filter', 'ทำให้ทนการเลื่อนเล็กน้อย'], a: 2, why: 'Max/average pooling เป็นการคำนวณตายตัว ไม่มีน้ำหนักให้เรียน' },
{ q: 'ในงาน multi-class ชั้น output ควรใช้ activation ใด', o: ['ReLU', 'Sigmoid', 'Softmax', 'ไม่ต้องใช้'], a: 2, why: 'Softmax ให้ความน่าจะเป็นของทุกคลาสรวมกันเป็น 1' },
],
},

]);

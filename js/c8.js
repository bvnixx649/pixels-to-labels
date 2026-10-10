/* Chapter 8: Image Feature Extraction */
window.LESSONS = (window.LESSONS || []).concat([

/* ------------------------------------------------------------------ */
{
id: 'features', ch: 8,
title: 'What is a Feature',
sub: 'Feature คืออะไร มีกี่ระดับ แบ่งแบบ local กับ global อย่างไร และเอาไปใช้ต่อในขั้นไหน',
desc: 'นิยาม 5 ชนิดของ feature, low/mid/high level, local กับ global, framework 5 ขั้น',
body: `
<p><strong>Feature (คุณลักษณะสำคัญ)</strong> คือข้อมูลที่ดึงออกมาจากภาพเพื่อใช้แทนคุณสมบัติของภาพ ทำให้คอมพิวเตอร์ “เข้าใจ” และเปรียบเทียบภาพได้ โดยไม่ต้องใช้ค่าพิกเซลทั้งหมด</p>
<div class="key">ภาพขนาด 640×480 มีตัวเลขกว่า 3 แสนค่า แต่ feature ที่ดีอาจเหลือแค่ไม่กี่สิบค่า และยังบอกได้ว่าภาพนี้ต่างจากภาพอื่นตรงไหน</div>
<p>Feature ที่ใช้บ่อยมี 5 ชนิด คือ <strong>ขอบ</strong> (Edges), <strong>มุม</strong> (Corners), <strong>รูปร่าง</strong> (Shapes), <strong>สี</strong> (Colors) และ <strong>พื้นผิว</strong> (Textures)</p>
<p><strong>Feature Extraction</strong> คือกระบวนการดึงหรือสกัดคุณลักษณะสำคัญเหล่านี้ออกมาเป็นตัวเลข</p>

<h2>Feature มี 3 ระดับ</h2>
<div class="tbl-wrap"><table class="tbl">
<tr><th>ระดับ</th><th>คืออะไร</th><th>ตัวอย่าง</th></tr>
<tr><td>Low-level</td><td>คุณลักษณะที่ได้จากพิกเซลในภาพโดยตรง</td><td>Pixel (ค่าความเข้มแสง/สีแต่ละตำแหน่ง), Color เช่น color histogram, Edge เช่น Sobel, Canny</td></tr>
<tr><td>Mid-level</td><td>รวม low-level หลายจุดเข้าด้วยกัน ให้เป็นลักษณะเด่นที่ซับซ้อนขึ้น</td><td>Shapes (รูปร่างวัตถุ), Contours (เส้นโครงล้อมรอบวัตถุ), Keypoints (จุดเด่นที่ต่างจากรอบข้างสูง เช่น มุม จุดตัดของขอบ)</td></tr>
<tr><td>High-level</td><td>ความหมาย (semantic) ของสิ่งที่อยู่ในภาพ</td><td>Objects เช่น รถ คน บ้าน, Faces การดึงลักษณะใบหน้า</td></tr>
</table></div>
<p>ถ้าวางในลำดับงาน DIP ทั้งหมด: <strong>low level</strong> คือ preprocessing (image enhancement, restoration), <strong>mid level</strong> คือการได้คุณสมบัติของวัตถุ (segmentation, feature extraction, object recognition) และ <strong>high level</strong> คือการทำความเข้าใจภาพ (machine learning for image) ดังนั้น feature extraction อยู่ในระดับกลาง เป็นสะพานระหว่างพิกเซลกับการตัดสินใจ</p>

<h2>Local กับ Global</h2>
<p><strong>Global feature extraction</strong> คำนวณ feature จากทั้งภาพเป็นก้อนเดียว เช่น color histogram ของทั้งภาพ ได้เวกเตอร์เดียวต่อภาพ เร็วและง่าย แต่ถ้าพื้นหลังรกหรือวัตถุถูกบัง ค่าจะเพี้ยนทั้งก้อน</p>
<p><strong>Local feature extraction</strong> คำนวณ feature เฉพาะบริเวณ จึงทนต่อการบัง พื้นหลัง การย่อขยาย การหมุน และการย้ายตำแหน่งได้ดีกว่า มี 2 แบบ</p>
<ul>
<li><strong>Block representation</strong> แบ่งภาพเป็นบล็อกหรือหน้าต่างย่อย แล้วดึง feature จากแต่ละบล็อก (ในสไลด์คือกรอบสี่เหลี่ยมหลายกรอบบนตึก)</li>
<li><strong>Region representation</strong> แยกบริเวณของวัตถุออกมาก่อน เช่นด้วย segmentation แล้วดึง feature จากบริเวณนั้น (ในสไลด์คือเครื่องบินที่ถูกแยกออกจากท้องฟ้าเป็นสีแดง)</li>
</ul>

<h2>Framework การวิเคราะห์ภาพด้วย feature</h2>
<div class="fig" data-fig="pipeline"></div>
<p>Feature ที่ดีควร <strong>แยกแยะได้</strong> (ภาพต่างคลาสได้ค่าต่างกัน), <strong>ทนต่อการเปลี่ยนแปลง</strong> (หมุน ย่อขยาย แสงเปลี่ยนแล้วค่ายังใกล้เดิม), <strong>กระชับ</strong> (จำนวนมิติน้อย) และ <strong>คำนวณเร็ว</strong></p>
`,
written: [
{ q: 'จงอธิบายความหมายของ Image Feature และ Feature Extraction พร้อมยกตัวอย่างชนิดของ feature อย่างน้อย 4 ชนิด', a: `
<p><strong>Image feature</strong> คือคุณลักษณะสำคัญของภาพที่ใช้แทนคุณสมบัติต่าง ๆ ของภาพ ทำให้คอมพิวเตอร์เข้าใจและเปรียบเทียบภาพได้โดยไม่ต้องใช้ค่าพิกเซลทั้งหมด ส่วน <strong>feature extraction</strong> คือกระบวนการดึงหรือสกัดคุณลักษณะเหล่านั้นออกมาให้อยู่ในรูปตัวเลข (feature vector)</p>
<p>ตัวอย่างชนิดของ feature</p>
<ul><li>ขอบ (Edges) เช่น ได้จาก Sobel, Canny</li><li>มุม (Corners) เช่น Harris corner</li><li>รูปร่าง (Shapes) เช่น พื้นที่ เส้นรอบรูป HOG</li><li>สี (Colors) เช่น color histogram</li><li>พื้นผิว (Textures) เช่น GLCM, LBP</li></ul>` },
{ q: 'จงอธิบายความแตกต่างของ Low-level, Mid-level และ High-level feature พร้อมยกตัวอย่างของแต่ละระดับ', a: `
<ul><li><strong>Low-level</strong> คือคุณลักษณะที่ได้จากพิกเซลโดยตรง เช่น ค่าความเข้มของพิกเซล color histogram และขอบจาก Sobel หรือ Canny</li>
<li><strong>Mid-level</strong> คือการรวม low-level หลายจุดเพื่อสร้างลักษณะเด่นที่ซับซ้อนขึ้น เช่น รูปร่าง (shape) เส้นโครงล้อมวัตถุ (contour) และจุดเด่น (keypoint) อย่างมุมหรือจุดตัดของขอบ</li>
<li><strong>High-level</strong> คือความหมาย (semantic) ของภาพ เช่น การรู้ว่าเป็นวัตถุอะไร (รถ คน บ้าน) หรือลักษณะใบหน้า</li></ul>
<p>ยิ่งระดับสูง feature ยิ่งใกล้ความหมายที่คนเข้าใจ และยิ่งต้องอาศัยการประมวลผลจากระดับล่างมากขึ้น</p>` },
{ q: 'Local feature extraction ต่างจาก Global feature extraction อย่างไร และ Block representation กับ Region representation ต่างกันอย่างไร', a: `
<p><strong>Global</strong> คำนวณ feature จากทั้งภาพเป็นค่าเดียว เช่น histogram ของทั้งภาพ ง่ายและเร็ว แต่ไวต่อพื้นหลังและการบังของวัตถุ</p>
<p><strong>Local</strong> คำนวณ feature เฉพาะบางบริเวณ ทำให้ทนต่อการย่อ ขยาย หมุน ย้ายตำแหน่ง และการบังได้ดีกว่า และวิเคราะห์ได้แม่นยำขึ้น แบ่งได้ 2 แบบ</p>
<ul><li><strong>Block representation</strong> แบ่งภาพเป็นบล็อกหรือหน้าต่างย่อยตามตำแหน่ง แล้วสกัด feature ของแต่ละบล็อก</li>
<li><strong>Region representation</strong> แยกบริเวณของวัตถุออกมาก่อน (เช่น ด้วย segmentation) แล้วสกัด feature จากบริเวณของวัตถุนั้น</li></ul>` },
{ q: 'จงอธิบาย framework การวิเคราะห์ภาพด้วย Feature Extraction ตั้งแต่รับภาพจนได้ผลลัพธ์ และยกตัวอย่างการนำไปใช้ 3 แบบ', a: `
<ol><li><strong>Input image</strong> รับภาพดิจิทัลเป็นพิกเซล</li>
<li><strong>Preprocess</strong> ปรับแสง ลด noise แปลงเป็น grayscale ปรับขนาด</li>
<li><strong>Feature extraction</strong> สกัดคุณลักษณะ เช่น สี รูปร่าง พื้นผิว</li>
<li><strong>Feature vector</strong> ได้เวกเตอร์ตัวเลข (descriptor) แทนภาพ</li>
<li><strong>Model / Matching</strong> นำเวกเตอร์เข้าโมเดล เช่น SVM, kNN, CNN หรือเทียบระยะกับภาพอื่น</li></ol>
<p>การนำไปใช้: <strong>Classification</strong> บอกว่าภาพนี้คือ “แมว”, <strong>Retrieval (CBIR)</strong> ค้นหาภาพที่คล้ายกัน และ <strong>Detection</strong> หาตำแหน่งของวัตถุในภาพ</p>` },
{ q: 'ทำไมจึงต้องสกัด feature แทนการนำค่าพิกเซลทั้งหมดไปใช้โดยตรง และ feature ที่ดีควรมีคุณสมบัติอย่างไร', tag: 'คิดวิเคราะห์', a: `
<p>ค่าพิกเซลทั้งหมดมีจำนวนมาก (มิติสูง) มีข้อมูลซ้ำซ้อนและ noise และเปลี่ยนไปมากเมื่อภาพถูกเลื่อน หมุน ย่อขยาย หรือแสงเปลี่ยน แม้จะเป็นวัตถุเดิม การสกัด feature จึงช่วยลดขนาดข้อมูล ตัดส่วนที่ไม่สำคัญ และเหลือเฉพาะข้อมูลที่ช่วยแยกแยะภาพ ทำให้โมเดลเรียนรู้ได้เร็วและแม่นขึ้น</p>
<p>Feature ที่ดีควร</p>
<ul><li>แยกแยะได้ (discriminative) ภาพต่างคลาสได้ค่าต่างกันชัดเจน</li><li>ทนต่อการเปลี่ยนแปลง (invariant/robust) ต่อการหมุน ย่อขยาย เลื่อน และแสง</li><li>กระชับ มีจำนวนมิติน้อย</li><li>คำนวณได้เร็ว</li></ul>` },
],
mcq: [
{ q: 'ข้อใดเป็น Mid-level feature', o: ['ค่าความเข้มของพิกเซล', 'Color histogram', 'Keypoints เช่น มุมและจุดตัดของขอบ', 'การรู้ว่าวัตถุคือ “รถ”'], a: 2, why: 'Mid-level คือการรวม low-level หลายจุดให้เป็นลักษณะที่ซับซ้อนขึ้น ได้แก่ shape, contour และ keypoint ส่วน pixel และ histogram เป็น low-level และการรู้ว่าเป็นรถเป็น high-level' },
{ q: 'Edge ที่ได้จาก Sobel หรือ Canny จัดเป็น feature ระดับใด', o: ['Low-level', 'Mid-level', 'High-level', 'ไม่นับเป็น feature'], a: 0, why: 'Edge คำนวณจากพิกเซลโดยตรง สไลด์จัดไว้ใน low-level ร่วมกับ pixel และ color' },
{ q: 'การแยกเครื่องบินออกจากท้องฟ้าก่อน แล้วจึงดึง feature จากบริเวณเครื่องบิน เป็นแบบใด', o: ['Global feature', 'Block representation', 'Region representation', 'Feature vector'], a: 2, why: 'Region representation แยกบริเวณวัตถุก่อน แล้วสกัด feature เฉพาะบริเวณนั้น ส่วน block แบ่งเป็นบล็อกตามตำแหน่งโดยไม่สนว่าเป็นวัตถุอะไร' },
{ q: 'ใน framework การวิเคราะห์ภาพ ขั้นที่ได้ “descriptor” ออกมาคือขั้นใด', o: ['Preprocess', 'Feature vector', 'Model / Matching', 'Input image'], a: 1, why: 'หลังสกัดคุณลักษณะ จะได้ feature vector ซึ่งเป็นเวกเตอร์ตัวเลขหรือ descriptor แล้วจึงส่งเข้าโมเดลหรือนำไปเทียบระยะ' },
{ q: 'ในลำดับงาน DIP ทั้งหมด Feature Extraction อยู่ในระดับใด', o: ['Low level ร่วมกับ enhancement', 'Mid level ร่วมกับ segmentation และ object recognition', 'High level ร่วมกับ understanding', 'อยู่ก่อน image acquisition'], a: 1, why: 'สไลด์แบ่ง Mid level เป็น Getting Object Attributes ได้แก่ segmentation, feature extraction และ object recognition' },
{ q: 'ค้นหาสินค้าที่คล้ายจากรูปถ่าย เป็นการใช้ feature แบบใด', o: ['Detection', 'Retrieval (CBIR)', 'Restoration', 'Segmentation'], a: 1, why: 'CBIR (Content-Based Image Retrieval) คือค้นภาพด้วยเนื้อหาของภาพ โดยเทียบ feature vector ว่าภาพไหนใกล้กันที่สุด' },
],
},

/* ------------------------------------------------------------------ */
{
id: 'color', ch: 8,
title: 'Color Features',
sub: 'Color histogram สองแบบ การ normalize และการวัดว่าสองฮิสโตแกรมเหมือนกันแค่ไหน',
desc: 'Separate กับ combined histogram, normalize, Euclidean, Chi-square, การประยุกต์',
body: `
<p>สีเป็น feature ที่<strong>ง่ายและเร็วที่สุด</strong> และ<strong>ทนต่อการหมุนและการย่อขยายภาพ</strong> เพราะการนับว่ามีสีอะไรกี่พิกเซลไม่สนใจว่าพิกเซลนั้นอยู่ตรงไหน จึงนิยมใช้ในงานค้นหาและจำแนกภาพ</p>

<h2>Color histogram</h2>
<p>คือการนับจำนวนพิกเซลในแต่ละช่วงของสี (เรียกแต่ละช่วงว่า <strong>bin</strong>) มี 2 แบบ</p>
<ul>
<li><strong>Separate-color histogram</strong> (H<sub>R</sub>, H<sub>G</sub>, H<sub>B</sub>) ทำฮิสโตแกรมแยกทีละช่องสี แล้วนำมาต่อกัน ถ้าช่องละ 8 bin จะได้ 3×8 = 24 ค่า เล็กและเร็ว แต่ไม่รู้ว่าค่า R, G, B มาจากพิกเซลเดียวกันหรือไม่</li>
<li><strong>Combined-color histogram</strong> (H<sub>RGB</sub>) แต่ละ bin คือสีที่เป็นคู่สาม (r, g, b) ร่วมกัน ถ้าช่องละ 8 ระดับจะมี 8×8×8 = 512 bin เก็บข้อมูลสีจริงของพิกเซลได้ครบกว่า แต่มีจำนวน bin มากกว่ามาก</li>
</ul>

<h2>Normalize ก่อนเทียบเสมอ</h2>
<p>ภาพที่ขนาดต่างกันมีจำนวนพิกเซลรวมไม่เท่ากัน ภาพใหญ่จะมีค่าในทุก bin สูงกว่าแม้สีเหมือนกันทุกอย่าง จึงต้องหารแต่ละ bin ด้วยจำนวนพิกเซลทั้งหมดให้กลายเป็นสัดส่วนก่อน</p>
<div class="eq"><span class="m">h'(i) = h(i) / N</span></div>
<dl class="sym"><dt>h(i)</dt><dd>จำนวนพิกเซลใน bin ที่ i</dd><dt>N</dt><dd>จำนวนพิกเซลทั้งหมดของภาพ</dd><dt>h'(i)</dt><dd>สัดส่วนของ bin i ผลรวมทุก bin เท่ากับ 1</dd></dl>

<h2>วัดความต่างของสองฮิสโตแกรม</h2>
<p>ทุกวิธีในบทนี้เป็น<strong>ระยะห่าง</strong> ค่ายิ่งใกล้ 0 แปลว่าสองภาพยิ่งเหมือนกัน</p>
<div class="fig" data-fig="histcompare"></div>
<div class="eq"><span class="m">Euclidean = √ Σ (H₁(i) − H₂(i))²</span><p>ทุก bin ถูกถ่วงน้ำหนักเท่ากันหมด</p></div>
<div class="eq"><span class="m">χ² (OpenCV) = Σ (H₁(i) − H₂(i))² / H₁(i)</span><p>แบบ HISTCMP_CHISQR หารด้วยค่าของฮิสโตแกรมแรก</p></div>
<div class="eq"><span class="m">χ² (สมมาตร) = ½ Σ (H₁(i) − H₂(i))² / (H₁(i) + H₂(i))</span><p>แบบที่ใช้ใน computer vision สลับ H₁ กับ H₂ แล้วได้ค่าเดิม</p></div>
<dl class="sym"><dt>H₁, H₂</dt><dd>ฮิสโตแกรมของภาพที่ 1 และภาพที่ 2</dd><dt>i</dt><dd>ลำดับ bin</dd><dt>Σ</dt><dd>รวมทุก bin</dd></dl>
<p>Chi-square ต่างจาก Euclidean ตรงที่หารด้วยขนาดของ bin ความต่างใน bin ที่มีค่าน้อยจึงมีผลมากกว่าความต่างขนาดเท่ากันใน bin ที่มีค่ามาก</p>

<h2>เอาไปใช้ทำอะไร</h2>
<ul>
<li><strong>ค้นภาพด้วยเนื้อหา (CBIR)</strong> ค้นภาพคล้ายจากคลังภาพ เช่น ค้นสินค้าจากรูป</li>
<li><strong>จำแนกฉาก (scene)</strong> แยกภาพทะเล ป่า เมือง จากโทนสี</li>
<li><strong>ตรวจจับผิวหนังหรือวัตถุสีเฉพาะ</strong> เช่น หาผลไม้สุก</li>
<li><strong>ติดตามวัตถุในวิดีโอ (tracking)</strong> ด้วย histogram สี เช่น CamShift</li>
</ul>
<p>ข้อจำกัดคือ histogram <strong>ไม่มีข้อมูลตำแหน่ง</strong> ภาพสองภาพที่จัดวางต่างกันโดยสิ้นเชิงแต่มีสัดส่วนสีเท่ากันจะได้ histogram เดียวกัน และค่าสีเปลี่ยนไปตามแสง นอกจาก histogram ยังมี <strong>color moments</strong> ที่สรุปแต่ละช่องสีด้วย mean, standard deviation และ skewness</p>
`,
written: [
{ q: 'Color histogram คืออะไร และ Separate-color histogram กับ Combined-color histogram แตกต่างกันอย่างไร', a: `
<p><strong>Color histogram</strong> คือการนับจำนวนพิกเซลในแต่ละช่วงสี (bin) ของภาพ ใช้เป็น feature ด้านสี</p>
<ul><li><strong>Separate (H<sub>R</sub>, H<sub>G</sub>, H<sub>B</sub>)</strong> สร้างฮิสโตแกรมแยกทีละช่องสีแล้วนำมาต่อกัน จำนวนค่าน้อย (เช่น 3×8 = 24) คำนวณเร็ว แต่สูญเสียความสัมพันธ์ระหว่างช่องสีของพิกเซลเดียวกัน</li>
<li><strong>Combined (H<sub>RGB</sub>)</strong> แต่ละ bin คือการรวม (r, g, b) ร่วมกัน เก็บสีจริงของพิกเซลได้ครบ แต่จำนวน bin มาก (เช่น 8×8×8 = 512)</li></ul>` },
{ q: 'ทำไมต้อง normalize histogram ก่อนนำมาเปรียบเทียบ', a: `
<p>เพราะภาพที่มีขนาดต่างกันมีจำนวนพิกเซลรวมไม่เท่ากัน ภาพที่ใหญ่กว่าจะมีจำนวนนับในแต่ละ bin มากกว่า แม้มีสีเหมือนกัน ถ้าไม่ normalize ระยะห่างจะบอกความต่างของขนาดภาพแทนความต่างของสี</p>
<p>วิธีทำคือหารจำนวนในแต่ละ bin ด้วยจำนวนพิกเซลทั้งหมด h'(i) = h(i)/N ทำให้แต่ละ bin เป็นสัดส่วนและผลรวมเท่ากับ 1</p>` },
{ q: 'จงเปรียบเทียบการวัดความเหมือนของ histogram ด้วย Euclidean distance และ Chi-square distance พร้อมบอกการแปลความหมายของค่าที่ได้', a: `
<ul><li><strong>Euclidean</strong> = √Σ(H₁−H₂)² ถ่วงน้ำหนักทุก bin เท่ากัน</li>
<li><strong>Chi-square</strong> = Σ(H₁−H₂)²/H₁ (แบบ OpenCV) หรือ ½Σ(H₁−H₂)²/(H₁+H₂) (แบบสมมาตร) หารด้วยขนาดของ bin ทำให้ความต่างใน bin ที่ค่าน้อยมีผลมากกว่า</li></ul>
<p>ทั้งสองเป็นค่าระยะห่าง ค่าเข้าใกล้ 0 หมายถึงสองภาพมีการกระจายสีเหมือนกันมาก ค่ายิ่งมากยิ่งต่างกัน</p>
<p>จากตัวอย่างในสไลด์ H₁ = [1,2,3,4], H₂ = [2,2,2,4] ได้ Euclidean = √2 ≈ 1.414, χ² แบบ OpenCV = 1.333 และแบบสมมาตร = 0.267</p>` },
{ q: 'จงบอกข้อดีและข้อจำกัดของ color feature และยกตัวอย่างกรณีที่ color histogram ใช้แยกภาพไม่ได้', tag: 'คิดวิเคราะห์', a: `
<p><strong>ข้อดี</strong> ง่ายและเร็วที่สุด ทนต่อการหมุนและการย่อขยาย (เพราะไม่ขึ้นกับตำแหน่งพิกเซล) และทนต่อการบังบางส่วน</p>
<p><strong>ข้อจำกัด</strong> ไม่มีข้อมูลตำแหน่งหรือรูปร่าง และไวต่อการเปลี่ยนแสง</p>
<p>ตัวอย่าง: ภาพธงที่มีแถบแดงด้านบนและขาวด้านล่าง กับภาพที่สลับเป็นขาวบนแดงล่าง มีจำนวนพิกเซลแดงและขาวเท่ากัน จะได้ histogram เดียวกันทั้งที่เป็นภาพต่างกัน หรือมะเขือเทศสีแดงกับรถสีแดงก็อาจมี histogram ใกล้กัน</p>` },
{ q: 'จงยกตัวอย่างการประยุกต์ใช้ color feature อย่างน้อย 3 งาน พร้อมอธิบายสั้น ๆ', a: `
<ul><li><strong>CBIR</strong> ค้นหาภาพที่คล้ายจากคลังภาพ เช่น ค้นสินค้าจากรูป</li>
<li><strong>Scene classification</strong> แยกภาพทะเล ป่า เมือง จากโทนสีรวม</li>
<li><strong>ตรวจจับผิวหนังหรือวัตถุสีเฉพาะ</strong> เช่น หาบริเวณสีผิว หรือคัดผลไม้สุก</li>
<li><strong>Tracking</strong> ติดตามวัตถุในวิดีโอด้วย histogram สี เช่น อัลกอริทึม CamShift</li></ul>` },
],
mcq: [
{ q: 'ใช้ 8 ระดับต่อช่องสี Combined-color histogram (H<sub>RGB</sub>) จะมีกี่ bin', o: ['24', '64', '256', '512'], a: 3, why: 'Combined นับคู่สาม (r,g,b) ร่วมกัน จึงเป็น 8×8×8 = 512 ส่วน 24 คือแบบ separate (3×8)' },
{ q: 'ผลการเทียบ histogram ด้วย Euclidean ได้ 0.02 แปลว่า', o: ['สองภาพต่างกันมาก', 'สองภาพมีการกระจายสีเหมือนกันมาก', 'ต้อง normalize ใหม่', 'ภาพมีขนาดเท่ากัน'], a: 1, why: 'Euclidean และ Chi-square เป็นระยะห่าง ยิ่งใกล้ 0 ยิ่งเหมือน' },
{ q: 'เหตุผลหลักที่ต้อง normalize histogram ก่อนเทียบคือ', o: ['ทำให้สีสดขึ้น', 'ภาพขนาดต่างกันมีจำนวนพิกเซลรวมไม่เท่ากัน', 'ลด noise', 'ทำให้ทนต่อการหมุน'], a: 1, why: 'ถ้าไม่หารด้วยจำนวนพิกเซลรวม ภาพใหญ่จะมีค่าในทุก bin สูงกว่าเสมอ' },
{ q: 'Chi-square แบบ OpenCV ต่างจาก Euclidean อย่างไร', o: ['ไม่ต้องยกกำลังสอง', 'หารความต่างแต่ละ bin ด้วยค่าของ H₁ ใน bin นั้น', 'ค่ายิ่งมากยิ่งเหมือน', 'ใช้ได้กับภาพขาวดำเท่านั้น'], a: 1, why: 'χ² = Σ(H₁−H₂)²/H₁ จึงถ่วงน้ำหนักไม่เท่ากัน ต่างจาก Euclidean ที่ทุก bin มีน้ำหนักเท่ากัน' },
{ q: 'ทำไม color histogram จึงทนต่อการหมุนภาพ', o: ['เพราะใช้ภาพขาวดำ', 'เพราะนับจำนวนพิกเซลแต่ละสีโดยไม่สนตำแหน่ง', 'เพราะผ่าน Gaussian blur', 'เพราะใช้ polar coordinate'], a: 1, why: 'หมุนภาพแล้วพิกเซลแค่ย้ายที่ จำนวนพิกเซลของแต่ละสีเท่าเดิม histogram จึงไม่เปลี่ยน' },
{ q: 'การติดตามวัตถุในวิดีโอด้วย histogram สี ใช้อัลกอริทึมใดเป็นตัวอย่างในสไลด์', o: ['CamShift', 'Canny', 'R-CNN', 'Hough'], a: 0, why: 'สไลด์ยก CamShift เป็นตัวอย่างการ tracking ด้วย color histogram' },
],
},

/* ------------------------------------------------------------------ */
{
id: 'boundary', ch: 8,
title: 'Shape: Boundary-Based',
sub: 'อธิบายรูปร่างจากเส้นขอบของวัตถุ: เส้นผ่านศูนย์กลาง เส้นรอบรูป Hough Transform และ Chain code',
desc: 'Hough line (polar), Hough circle, Generalized Hough + R-table, chain code 4/8 ทิศ',
body: `
<p><strong>Shape feature</strong> อธิบายรูปทรง ขอบเขต และขนาดของวัตถุ เพื่อแยกวัตถุออกจากพื้นหลัง และแยกวัตถุที่รูปร่างต่างกัน แบ่งเป็น 2 แบบ</p>
<ul><li><strong>Boundary-based (เชิงขอบเขต)</strong> ใช้เฉพาะเส้นขอบของวัตถุ บทนี้</li><li><strong>Region-based (เชิงบริเวณ)</strong> ใช้ทุกพิกเซลภายในวัตถุ บทถัดไป</li></ul>
<p>Feature เชิงขอบเขตที่ต้องรู้</p>
<ul>
<li><strong>เส้นผ่านศูนย์กลาง (Diameter)</strong> ระยะที่ไกลที่สุดระหว่างจุดสองจุดบนขอบ บอกขนาดของวัตถุ</li>
<li><strong>ความยาวเส้นรอบรูป (Perimeter)</strong> ความยาวของขอบทั้งหมด</li>
<li><strong>Hough Transform</strong> ตรวจจับรูปทรงเรขาคณิต เช่น เส้นตรง วงกลม วงรี</li>
<li><strong>Chain code</strong> เข้ารหัสขอบเป็นลำดับทิศทาง</li>
</ul>
<p>ตัวอย่างงาน: line detection, circle detection และ lane detection (หาเลนถนนให้รถขับเอง)</p>

<h2>Hough Transform</h2>
<p>คือวิธีหาวัตถุในภาพที่มีรูปทรงเรขาคณิตซึ่ง<strong>เขียนเป็นสมการได้</strong> มี 3 แบบ: <strong>Hough Line</strong> (เส้นตรง), <strong>Hough Circle</strong> (วงกลม) และ <strong>Generalized Hough</strong> (รูปทรงทั่วไป)</p>
<div class="key">หลักการคือ <strong>การโหวต</strong> ทุกจุดขอบโหวตให้ “ทุกรูปทรงที่เป็นไปได้ว่าจะผ่านตัวมัน” ลงในตารางสะสมคะแนน (accumulator) รูปทรงที่ได้คะแนนสูงสุดคือรูปทรงที่มีอยู่จริงในภาพ</div>
<p>ขั้นตอนทั่วไป: หาขอบก่อน (เช่น Canny) แล้วให้แต่ละจุดขอบโหวตใน parameter space จากนั้นเลือกจุดที่มีคะแนนเกิน threshold</p>

<h3>Hough Line</h3>
<p>เส้นตรงปกติเขียนเป็น y = mx + c แต่เส้นแนวตั้งมีความชัน m เป็นอนันต์ ใส่ในตารางไม่ได้ จึงเปลี่ยนไปใช้<strong>พิกัดเชิงขั้ว (polar)</strong></p>
<div class="eq"><span class="m">r = x cos θ + y sin θ</span></div>
<dl class="sym"><dt>r</dt><dd>ระยะตั้งฉากจากจุดกำเนิดถึงเส้น</dd><dt>θ</dt><dd>มุมของเส้นตั้งฉากนั้นกับแกน x</dd><dt>(x, y)</dt><dd>จุดขอบในภาพ</dd></dl>
<p>จุดหนึ่งจุดในภาพมีเส้นผ่านได้นับไม่ถ้วน เมื่อแปลงไปใน space ของ (θ, r) จะกลายเป็น<strong>เส้นโค้งไซน์ 1 เส้น</strong> ถ้าหลายจุดอยู่บนเส้นตรงเดียวกัน เส้นโค้งของพวกมันจะตัดกันที่จุดเดียว ซึ่งก็คือค่า (θ, r) ของเส้นนั้น</p>
<div class="fig" data-fig="hough"></div>

<h3>Hough Circle</h3>
<div class="eq"><span class="m">(x − a)² + (y − b)² = r²</span><p>x = a + r cos θ และ y = b + r sin θ</p></div>
<dl class="sym"><dt>(a, b)</dt><dd>จุดศูนย์กลางวงกลม</dd><dt>r</dt><dd>รัศมี</dd><dt>θ</dt><dd>มุมรอบวง 0 ถึง 360°</dd></dl>
<p>วงกลมมี 3 พารามิเตอร์ (a, b, r) ตารางโหวตจึงเป็น 3 มิติ ถ้ารู้รัศมี r แล้ว จุดขอบแต่ละจุดจะโหวตให้วงกลมรัศมี r รอบตัวมันเอง (ทุกจุดที่อาจเป็นศูนย์กลาง) จุดที่วงกลมเหล่านั้นตัดกันมากที่สุดคือศูนย์กลางจริง ใช้หาเหรียญ กระป๋อง หรือรูม่านตา</p>

<h3>Generalized Hough Transform</h3>
<p>ตรวจจับ<strong>รูปทรงซับซ้อนอะไรก็ได้</strong> โดยใช้ <strong>R-table (Reference Table)</strong> เป็นตัวแทนรูปร่าง แทนการใช้สมการทางคณิตศาสตร์ มี 4 ขั้นตอน</p>
<ol>
<li><strong>Template definition</strong> กำหนดรูปร่างเป้าหมายที่ต้องการตรวจหา และเลือกจุดอ้างอิง (reference point) ภายในรูป</li>
<li><strong>R-table creation</strong> สร้างตาราง R เก็บความสัมพันธ์ระหว่างมุม (gradient ที่ขอบ) กับระยะ (เวกเตอร์จากจุดขอบไปยังจุดอ้างอิง)</li>
<li><strong>Edge detection</strong> ตรวจหาจุดขอบในภาพที่ต้องการวิเคราะห์</li>
<li><strong>Voting process</strong> แต่ละจุดขอบเปิด R-table ตามมุมของมัน แล้วลงคะแนนตำแหน่งจุดอ้างอิงที่เป็นไปได้ใน parameter space จุดที่ได้คะแนนสูงสุดคือตำแหน่งของวัตถุ</li>
</ol>

<h2>Chain code (รหัสลูกโซ่)</h2>
<p>ใช้แทนขอบเขตของวัตถุ โดยแสดง<strong>ลำดับการเชื่อมต่อของส่วนของเส้นตรงและทิศทาง</strong> เดินไปตามขอบทีละก้าวแล้วจดว่าก้าวไปทิศไหน มี 2 แบบ</p>
<ul><li><strong>4-directional chain code</strong> ใช้ 4 ทิศ ห่างกันทีละ 90° รหัส 0 ถึง 3</li><li><strong>8-directional chain code</strong> ใช้ 8 ทิศ ห่างกันทีละ 45° รหัส 0 ถึง 7 รวมทิศทแยงด้วย</li></ul>
<div class="fig" data-fig="chaincode"></div>
<p>ก่อนเข้ารหัสมักลดความละเอียดของขอบลงบนกริดที่หยาบกว่า (resampling) เพื่อตัดรอยหยักเล็ก ๆ ข้อดีของ chain code คือเก็บรูปร่างได้กระชับและไม่ขึ้นกับตำแหน่งของวัตถุ แต่รหัสจะเปลี่ยนเมื่อเปลี่ยนจุดเริ่มต้นหรือหมุนวัตถุ จึงมักปรับให้เป็นมาตรฐานด้วยการเลือกจุดเริ่มที่ทำให้รหัสเป็นตัวเลขน้อยที่สุด และใช้ผลต่างของรหัสที่ติดกัน (first difference) เพื่อให้ทนต่อการหมุน</p>
`,
written: [
{ q: 'Shape feature แบบ Boundary-based และ Region-based แตกต่างกันอย่างไร จงยกตัวอย่าง feature ของแต่ละแบบ', a: `
<ul><li><strong>Boundary-based</strong> วิเคราะห์รูปร่างจากเส้นขอบ (boundary) ของวัตถุเท่านั้น ตัวอย่างเช่น เส้นผ่านศูนย์กลาง (diameter), ความยาวเส้นรอบรูป (perimeter), Hough transform และ chain code</li>
<li><strong>Region-based</strong> วิเคราะห์จากเนื้อหาภายในบริเวณของวัตถุทุกพิกเซล ตัวอย่างเช่น พื้นที่ (area), ค่าเฉลี่ยความเข้ม (mean intensity), โมเมนต์ (moments) และ HOG</li></ul>
<p>ทั้งสองแบบใช้แยกวัตถุออกจากพื้นหลังและแยกวัตถุที่รูปร่างต่างกัน</p>` },
{ q: 'จงอธิบายหลักการทำงานของ Hough Transform', a: `
<p>Hough transform เป็นวิธีตรวจหารูปทรงเรขาคณิตที่เขียนเป็นสมการได้ เช่น เส้นตรง วงกลม โดยอาศัยการโหวต</p>
<ol><li>หาจุดขอบของภาพก่อน เช่น ด้วย Canny</li>
<li>แต่ละจุดขอบคำนวณพารามิเตอร์ของทุกรูปทรงที่เป็นไปได้ที่ผ่านจุดนั้น แล้วเพิ่มคะแนนในตารางสะสม (accumulator) ของ parameter space</li>
<li>ตำแหน่งใน accumulator ที่ได้คะแนนสูง (peak) แปลว่ามีหลายจุดขอบเห็นตรงกัน คือรูปทรงที่มีอยู่จริงในภาพ</li></ol>
<p>ข้อดีคือทนต่อ noise และเส้นที่ขาดเป็นช่วง ๆ เพราะไม่ต้องใช้ทุกจุดก็ยังได้คะแนนสูงพอ</p>` },
{ q: 'ทำไม Hough Line Transform จึงใช้สมการพิกัดเชิงขั้ว r = x cosθ + y sinθ แทนสมการ y = mx + c', a: `
<p>สมการ y = mx + c มีปัญหากับเส้นแนวตั้ง เพราะความชัน m มีค่าเป็นอนันต์ จึงสร้างตาราง accumulator ที่มีขอบเขตจำกัดไม่ได้ ส่วนพิกัดเชิงขั้วใช้ r (ระยะตั้งฉากจากจุดกำเนิดถึงเส้น) และ θ (มุมของเส้นตั้งฉาก) ซึ่งมีช่วงจำกัดเสมอ θ อยู่ระหว่าง 0 ถึง 180° และ r ไม่เกินเส้นทแยงของภาพ จึงแทนได้ทุกเส้นรวมเส้นแนวตั้ง</p>
<p>ในพิกัดนี้ 1 จุดในภาพกลายเป็นเส้นโค้งไซน์ 1 เส้นใน (θ, r) และจุดที่อยู่บนเส้นเดียวกันจะมีเส้นโค้งตัดกันที่ (θ, r) เดียวกัน</p>` },
{ q: 'Hough Circle Transform มีพารามิเตอร์อะไรบ้าง และตรวจหาวงกลมได้อย่างไร', a: `
<p>สมการวงกลม (x−a)² + (y−b)² = r² มี 3 พารามิเตอร์ คือ จุดศูนย์กลาง (a, b) และรัศมี r ตาราง accumulator จึงเป็น 3 มิติ</p>
<p>จากรูป x = a + r cosθ, y = b + r sinθ จะได้ a = x − r cosθ และ b = y − r sinθ เมื่อกำหนด r แต่ละจุดขอบ (x, y) จะโหวตให้ทุกจุดศูนย์กลางที่เป็นไปได้ ซึ่งเรียงเป็นวงกลมรัศมี r รอบจุดนั้น จุด (a, b) ที่วงกลมโหวตจากหลายจุดขอบตัดกันมากที่สุดคือศูนย์กลางของวงกลมจริง ใช้ตรวจหาเหรียญ กระป๋อง หรือม่านตา</p>` },
{ q: 'Generalized Hough Transform ต่างจาก Hough Transform แบบเดิมอย่างไร จงอธิบายขั้นตอนการทำงาน', a: `
<p>Hough แบบเดิมใช้ได้กับรูปทรงที่มีสมการคณิตศาสตร์เท่านั้น ส่วน Generalized Hough ตรวจจับรูปทรงซับซ้อนใดก็ได้ โดยใช้ <strong>R-table</strong> เป็นตัวแทนรูปร่างแทนสมการ</p>
<ol><li><strong>Template definition</strong> กำหนดรูปร่างต้นแบบที่ต้องการตรวจหา และจุดอ้างอิง</li>
<li><strong>R-table creation</strong> สร้างตาราง R เก็บความสัมพันธ์ระหว่างมุม gradient ที่จุดขอบกับระยะ/ทิศทางไปยังจุดอ้างอิง</li>
<li><strong>Edge detection</strong> หาจุดขอบในภาพที่ต้องการวิเคราะห์</li>
<li><strong>Voting</strong> แต่ละจุดขอบเปิด R-table ตามมุมของตน แล้วโหวตตำแหน่งจุดอ้างอิงที่เป็นไปได้ จุดที่คะแนนสูงสุดคือตำแหน่งวัตถุ</li></ol>` },
{ q: 'Chain code คืออะไร 4-directional กับ 8-directional ต่างกันอย่างไร และมีข้อจำกัดอะไร', a: `
<p><strong>Chain code</strong> คือการแทนขอบเขตของวัตถุด้วยลำดับรหัสทิศทางของส่วนเส้นตรงที่เชื่อมต่อกัน โดยเดินไปตามขอบแล้วบันทึกทิศของแต่ละก้าว</p>
<ul><li><strong>4 ทิศ</strong> ใช้รหัส 0 ถึง 3 ห่างกันทีละ 90° (ขวา ขึ้น ซ้าย ลง)</li><li><strong>8 ทิศ</strong> ใช้รหัส 0 ถึง 7 ห่างกันทีละ 45° รวมทิศทแยง จึงแทนขอบเฉียงได้สั้นและใกล้รูปจริงกว่า</li></ul>
<p><strong>ข้อจำกัด</strong> รหัสขึ้นกับจุดเริ่มต้นและการหมุนของวัตถุ และไวต่อ noise ที่ขอบ แก้โดย resample ขอบให้หยาบลง เลือกจุดเริ่มที่ให้รหัสน้อยที่สุด และใช้ first difference เพื่อให้ทนต่อการหมุน</p>` },
{ q: 'จงยกตัวอย่างการประยุกต์ใช้ boundary-based shape feature อย่างน้อย 3 งาน', a: `
<ul><li><strong>Line detection</strong> หาเส้นตรงในภาพ เช่น ขอบตึก ขอบเอกสาร ด้วย Hough line</li>
<li><strong>Lane detection</strong> หาเส้นแบ่งเลนบนถนนสำหรับระบบช่วยขับขี่</li>
<li><strong>Circle detection</strong> หาเหรียญ กระป๋อง ลูกบอล หรือม่านตา ด้วย Hough circle</li>
<li><strong>Shape matching</strong> เปรียบเทียบรูปร่างวัตถุด้วย chain code หรือ generalized Hough</li></ul>` },
],
mcq: [
{ q: 'ในพิกัด (θ, r) ของ Hough line จุด 1 จุดในภาพจะกลายเป็นอะไร', o: ['จุด 1 จุด', 'เส้นตรง 1 เส้น', 'เส้นโค้งไซน์ 1 เส้น', 'วงกลม 1 วง'], a: 2, why: 'r = x cosθ + y sinθ เมื่อ x, y คงที่และ θ เปลี่ยน r จะเป็นเส้นโค้งรูปไซน์ จุดบนเส้นเดียวกันให้เส้นโค้งตัดกันที่จุดเดียว' },
{ q: 'Hough Circle ที่ไม่รู้รัศมีล่วงหน้า ต้องใช้ accumulator กี่มิติ', o: ['1', '2', '3', '4'], a: 2, why: 'พารามิเตอร์คือ a, b และ r รวม 3 มิติ' },
{ q: 'Generalized Hough Transform ใช้อะไรแทนสมการคณิตศาสตร์', o: ['Chain code', 'R-table', 'GLCM', 'Kernel 3×3'], a: 1, why: 'R-table (Reference table) เก็บความสัมพันธ์มุมกับระยะไปยังจุดอ้างอิง ใช้แทนรูปร่างที่ไม่มีสมการ' },
{ q: 'ลำดับขั้นของ Generalized Hough ข้อใดถูก', o: ['Voting → Edge detection → R-table → Template', 'Template definition → R-table creation → Edge detection → Voting', 'Edge detection → Template → Voting → R-table', 'R-table → Voting → Template → Edge detection'], a: 1, why: 'กำหนดต้นแบบ สร้าง R-table จากต้นแบบ หาขอบในภาพจริง แล้วจึงโหวต' },
{ q: '8-directional chain code ใช้รหัสทิศห่างกันทีละกี่องศา', o: ['30°', '45°', '90°', '180°'], a: 1, why: '360° ÷ 8 = 45° ส่วนแบบ 4 ทิศห่างกัน 90°' },
{ q: 'ข้อใดไม่ใช่ boundary-based feature', o: ['Perimeter', 'Diameter', 'Area', 'Chain code'], a: 2, why: 'Area นับจำนวนพิกเซลภายในวัตถุ จึงเป็น region-based' },
{ q: 'เหตุผลที่ไม่ใช้ y = mx + c ใน Hough line คือ', o: ['คำนวณช้า', 'เส้นแนวตั้งมีความชันเป็นอนันต์', 'ใช้กับภาพสีไม่ได้', 'ไม่มีจุดตัดแกน'], a: 1, why: 'm ของเส้นแนวตั้งเป็น ∞ ทำตาราง accumulator ที่มีขอบเขตไม่ได้ จึงใช้ (θ, r) ที่มีช่วงจำกัด' },
],
},

/* ------------------------------------------------------------------ */
{
id: 'hog', ch: 8,
title: 'Region-Based & HOG',
sub: 'อธิบายรูปร่างจากพิกเซลทุกตัวในวัตถุ: พื้นที่ ความเข้มเฉลี่ย โมเมนต์ และ Histogram of Oriented Gradients',
desc: 'Area, mean intensity, moments, HOG ทั้ง 6 ขั้น, ทำไมต้อง normalize block',
body: `
<p><strong>Region-based</strong> วิเคราะห์จากเนื้อหาภายในบริเวณของวัตถุ</p>
<ul>
<li><strong>ค่าพื้นที่ (Area)</strong> นับจำนวนพิกเซลในวัตถุ</li>
<li><strong>ค่าเฉลี่ยความเข้มสี (Mean intensity)</strong> ความสว่างเฉลี่ยของพิกเซลในวัตถุ</li>
<li><strong>โมเมนต์ (Moments)</strong> บอกการกระจายตัวของพิกเซล</li>
<li><strong>HOG</strong> ใช้ histogram ของทิศทาง gradient</li>
</ul>
<div class="eq"><span class="m">m<sub>pq</sub> = Σ Σ x<sup>p</sup> y<sup>q</sup> I(x, y)</span></div>
<dl class="sym"><dt>m₀₀</dt><dd>ผลรวมทั้งหมด ในภาพไบนารีคือพื้นที่</dd><dt>m₁₀/m₀₀, m₀₁/m₀₀</dt><dd>จุดศูนย์กลางมวล (centroid) ของวัตถุ</dd><dt>p, q</dt><dd>อันดับของโมเมนต์ อันดับสูงขึ้นบอกการกระจายและทิศทางของรูปร่าง</dd></dl>
<p>โมเมนต์ที่คำนวณรอบ centroid และปรับสเกลแล้ว (เช่น Hu moments) ทนต่อการเลื่อน การย่อขยาย และการหมุน จึงใช้เทียบรูปร่างได้</p>

<h2>Histogram of Oriented Gradients</h2>
<p>HOG วิเคราะห์<strong>ทิศทางและขนาด (magnitude) ของ gradient</strong> ในภาพ โดยสร้าง histogram ของทิศทาง gradient ในบริเวณย่อย ๆ ซึ่งให้ข้อมูลเกี่ยวกับ<strong>รูปร่างและพื้นผิว</strong>ของวัตถุ</p>
<div class="key">รูปร่างของคนบอกได้จาก “ขอบส่วนใหญ่ชี้ไปทางไหน” ในแต่ละช่องเล็ก ๆ โดยไม่ต้องรู้ตำแหน่งขอบแบบเป๊ะ ๆ HOG จึงทนต่อการขยับเล็กน้อยและถูกคิดค้นขึ้นมาเพื่อตรวจจับมนุษย์</div>

<h2>6 ขั้นตอนของ HOG</h2>
<h3>1. คำนวณ gradient</h3>
<div class="eq"><span class="m">Gx = I(x+1, y) − I(x−1, y)<br>Gy = I(x, y+1) − I(x, y−1)</span></div>
<dl class="sym"><dt>I(x, y)</dt><dd>ค่าความเข้มของพิกเซลที่คอลัมน์ x แถว y</dd><dt>Gx</dt><dd>gradient แนวนอน (ขวาลบซ้าย)</dd><dt>Gy</dt><dd>gradient แนวตั้ง (ล่างลบบน)</dd></dl>
<h3>2. สร้าง gradient maps</h3>
<div class="eq"><span class="m">|G| = √(Gx² + Gy²) &nbsp;&nbsp; θ = arctan(Gy / Gx)</span></div>
<dl class="sym"><dt>|G|</dt><dd>magnitude ความแรงของขอบ</dd><dt>θ</dt><dd>ทิศทางของ gradient ใช้ช่วง 0 ถึง 180° (unsigned)</dd></dl>
<div class="fig" data-fig="hog"></div>
<h3>3. แบ่งภาพเป็น cells</h3>
<p>กำหนด <code>cell_size</code> เช่น 2×2 พิกเซลในตัวอย่างสไลด์ (งานจริงนิยม 8×8) ภาพ 6×6 จึงได้ 3×3 = 9 cells พารามิเตอร์อื่นคือ <code>block_size = (2, 2)</code> จำนวน cell ต่อ block, <code>n_bins = 9</code> และช่วงมุม 180°</p>
<h3>4. ทำ histogram ทิศทางของแต่ละ cell</h3>
<p>แบ่ง 180° เป็น 9 bins ได้ bin ละ <strong>20°</strong> (0–20, 20–40, …, 160–180) แต่ละพิกเซลใน cell ลงคะแนนใน bin ตามมุม θ ของตัวเอง โดยคะแนนที่ใส่คือ <strong>magnitude</strong> ไม่ใช่ 1 ขอบที่แรงจึงมีผลมากกว่า</p>
<h3>5. รวม cells เป็น blocks</h3>
<p>Block ขนาด 2×2 cells นำ histogram ของ 4 cells มาต่อกัน ได้ <strong>4 × 9 = 36</strong> ค่าต่อ block และ block จะเลื่อนทับกันทีละ 1 cell</p>
<h3>6. Block normalization</h3>
<div class="eq"><span class="m">v' = v / √(Σ v²)</span><p>หารทุกค่าใน block ด้วย L2-norm ของ block</p></div>
<p>ความสว่างของภาพเปลี่ยนแล้ว magnitude เปลี่ยนตามทั้งก้อน การ normalize ทำให้เหลือแค่ “สัดส่วนของทิศ” จึง<strong>ทนต่อการเปลี่ยนแสงและ contrast</strong> สุดท้ายนำทุก block มาต่อกันเป็น HOG descriptor แล้วส่งเข้า classifier เช่น SVM</p>

<h2>การประยุกต์ใช้</h2>
<ul>
<li><strong>ตรวจจับคนเดินถนน</strong> งานต้นแบบ HOG + SVM ในระบบช่วยขับขี่ (ADAS)</li>
<li><strong>ตรวจจับวัตถุทั่วไป</strong> รถ ป้ายจราจร ใบหน้า ในยุคก่อน deep learning</li>
<li><strong>จดจำท่าทางและคน</strong> วิเคราะห์รูปร่างมนุษย์ในภาพนิ่งและวิดีโอ</li>
<li><strong>ตรวจอักษรและโลโก้</strong> จำแนกรูปทรงตัวอักษรและสัญลักษณ์</li>
</ul>
`,
written: [
{ q: 'Region-based shape feature มีอะไรบ้าง จงอธิบายแต่ละตัว', a: `
<ul><li><strong>Area</strong> นับจำนวนพิกเซลภายในวัตถุ บอกขนาด</li>
<li><strong>Mean intensity</strong> ค่าเฉลี่ยความเข้มของพิกเซลในวัตถุ</li>
<li><strong>Moments</strong> บอกการกระจายตัวของพิกเซล m<sub>pq</sub> = ΣΣ x<sup>p</sup>y<sup>q</sup>I(x,y) ใช้หาพื้นที่ (m₀₀) จุดศูนย์กลางมวล (m₁₀/m₀₀, m₀₁/m₀₀) และการวางตัวของวัตถุ</li>
<li><strong>HOG</strong> ใช้ histogram ของทิศทาง gradient อธิบายรูปร่างและพื้นผิว</li></ul>` },
{ q: 'HOG (Histogram of Oriented Gradients) คืออะไร และทำไมจึงเหมาะกับการตรวจจับคน', a: `
<p>HOG คือ feature ที่วิเคราะห์ทิศทางและขนาดของ gradient ในภาพ โดยแบ่งภาพเป็นบริเวณย่อย (cell) และสร้าง histogram ของทิศทาง gradient ในแต่ละ cell ทำให้ได้ข้อมูลรูปร่างและพื้นผิวของวัตถุ</p>
<p>เหมาะกับการตรวจจับคนเพราะรูปร่างคน (หัว ไหล่ ขา) แสดงออกด้วยทิศทางของขอบที่มีลักษณะเฉพาะ HOG เก็บ “การกระจายของทิศขอบ” ในแต่ละบริเวณ จึงไม่ต้องรู้ตำแหน่งขอบแบบแม่นยำ ทนต่อการขยับเล็กน้อยของท่าทาง และเมื่อ normalize block แล้วยังทนต่อแสง HOG ถูกคิดค้นมาเพื่อการตรวจจับมนุษย์ และใช้คู่กับ SVM ในระบบตรวจจับคนเดินถนน</p>` },
{ q: 'จงอธิบายขั้นตอนการคำนวณ HOG ทั้ง 6 ขั้น', a: `
<ol><li><strong>คำนวณ gradient</strong> Gx = I(x+1,y) − I(x−1,y) และ Gy = I(x,y+1) − I(x,y−1)</li>
<li><strong>สร้าง gradient maps</strong> magnitude |G| = √(Gx²+Gy²) และ direction θ = arctan(Gy/Gx)</li>
<li><strong>แบ่ง cells</strong> แบ่งภาพเป็น cell เช่น 2×2 หรือ 8×8 พิกเซล</li>
<li><strong>ทำ histogram ของแต่ละ cell</strong> แบ่ง 0–180° เป็น 9 bins (bin ละ 20°) แต่ละพิกเซลโหวตลง bin ตามมุม ด้วยน้ำหนักเท่ากับ magnitude</li>
<li><strong>รวม cells เป็น block</strong> เช่น 2×2 cells ต่อ histogram กันได้ 4×9 = 36 ค่า</li>
<li><strong>Block normalization</strong> หารด้วย L2-norm ของ block เพื่อลดผลของแสง แล้วต่อทุก block เป็น feature vector</li></ol>` },
{ q: 'ทำไม HOG ต้องทำ Block Normalization', a: `
<p>เพราะค่า magnitude ของ gradient ขึ้นกับความสว่างและ contrast ของภาพ ถ้าภาพมืดลงหรือสว่างขึ้น ค่าใน histogram จะลดหรือเพิ่มทั้งชุด แม้รูปร่างเหมือนเดิม การหารด้วย L2-norm (v / √Σv²) ทำให้เหลือเพียงสัดส่วนของแต่ละทิศ feature จึงทนต่อการเปลี่ยนแปลงของแสงและเงาในแต่ละบริเวณของภาพ</p>
<p>ตัวอย่างในสไลด์: L2-norm = √8934.7 = 94.5 ค่า 15.2 จึงกลายเป็น 15.2/94.5 = 0.161</p>` },
{ q: 'ใน HOG ที่ใช้ 9 bins ช่วงมุม 180° แต่ละ bin กว้างกี่องศา และ block 2×2 cells จะได้ feature กี่ค่า อธิบายที่มา', a: `
<p>แต่ละ bin กว้าง 180° ÷ 9 = <strong>20°</strong> คือ 0–20°, 20–40°, …, 160–180°</p>
<p>หนึ่ง cell ให้ histogram 9 ค่า block ขนาด 2×2 มี 4 cells จึงได้ 4 × 9 = <strong>36 ค่า</strong> ต่อ block</p>
<p>ใช้ช่วง 0–180° (unsigned gradient) เพราะขอบจากมืดไปสว่างกับสว่างไปมืดในทิศเดียวกันถือเป็นขอบรูปร่างเดียวกัน</p>` },
{ q: 'ในการทำ histogram ของแต่ละ cell ของ HOG แต่ละพิกเซลลงคะแนนใน bin อย่างไร และทำไมจึงใช้ magnitude เป็นน้ำหนัก', a: `
<p>แต่ละพิกเซลดูมุม θ ของตัวเองว่าตกใน bin ใด แล้วบวก magnitude |G| ของพิกเซลนั้นเข้าไปใน bin นั้น (ไม่ได้บวก 1) เช่น พิกเซลที่ θ = 24.2° และ |G| = 23.3 จะบวก 23.3 ลงใน bin 20–40°</p>
<p>ใช้ magnitude เป็นน้ำหนักเพราะพิกเซลที่เป็นขอบชัดเจนควรมีผลต่อรูปร่างมากกว่าพิกเซลในบริเวณเรียบซึ่ง gradient เกือบเป็นศูนย์และมุมไม่มีความหมาย</p>` },
{ q: 'จงยกตัวอย่างการประยุกต์ใช้ HOG อย่างน้อย 3 งาน', a: `
<ul><li><strong>ตรวจจับคนเดินถนน</strong> HOG + SVM ในระบบช่วยขับขี่ (ADAS)</li>
<li><strong>ตรวจจับวัตถุทั่วไป</strong> เช่น รถ ป้ายจราจร ใบหน้า ก่อนยุค deep learning</li>
<li><strong>จดจำท่าทาง/คน</strong> วิเคราะห์รูปร่างมนุษย์ในภาพนิ่งและวิดีโอ</li>
<li><strong>ตรวจอักษร/โลโก้</strong> จำแนกรูปทรงตัวอักษรและสัญลักษณ์</li></ul>` },
],
mcq: [
{ q: 'HOG ถูกคิดค้นขึ้นมาเพื่อใช้ตรวจจับอะไรเป็นหลัก', o: ['ใบหน้า', 'มนุษย์', 'ตัวอักษร', 'วงกลม'], a: 1, why: 'สไลด์ระบุว่า HOG คิดค้นมาเพื่อใช้ตรวจจับมนุษย์ และนิยมคู่กับ SVM ตรวจจับคนเดินถนน' },
{ q: 'n_bins = 9 ช่วงมุม 180° มุม 45° จะตกใน bin ใด (bin แรกคือ bin 0)', o: ['bin 1 (20–40°)', 'bin 2 (40–60°)', 'bin 3 (60–80°)', 'bin 4 (80–100°)'], a: 1, why: '45 ÷ 20 = 2.25 ปัดลงเป็น bin 2 คือช่วง 40–60°' },
{ q: 'Block 2×2 cells และ 9 bins ให้ feature กี่ค่าต่อ block', o: ['9', '18', '36', '81'], a: 2, why: '4 cells × 9 bins = 36' },
{ q: 'จุดประสงค์ของ Block normalization ใน HOG คือ', o: ['ลดขนาดภาพ', 'ทำให้ทนต่อการเปลี่ยนแสงและ contrast', 'เพิ่มจำนวน bin', 'หาขอบภาพ'], a: 1, why: 'หารด้วย L2-norm ทำให้ค่าเหลือเพียงสัดส่วนของทิศ ไม่ขึ้นกับความสว่างรวม' },
{ q: 'ในการโหวตลง bin ของ HOG แต่ละพิกเซลบวกค่าอะไรลงไป', o: ['1 เสมอ', 'ค่าความเข้มของพิกเซล', 'magnitude ของ gradient', 'มุม θ'], a: 2, why: 'ใช้ magnitude เป็นน้ำหนัก ขอบที่แรงจึงมีผลมากกว่า' },
{ q: 'ค่า m₀₀ ของภาพไบนารีคืออะไร', o: ['จุดศูนย์กลาง', 'พื้นที่ของวัตถุ', 'เส้นรอบรูป', 'มุมการวางตัว'], a: 1, why: 'm₀₀ = ΣΣ I(x,y) ในภาพไบนารีคือจำนวนพิกเซลของวัตถุ = area' },
{ q: 'Gx ที่พิกเซลค่า 28 ซึ่งมีเพื่อนบ้านซ้าย 21 และขวา 35 มีค่าเท่าใด', o: ['7', '14', '49', '56'], a: 1, why: 'Gx = I(x+1,y) − I(x−1,y) = 35 − 21 = 14' },
],
},

/* ------------------------------------------------------------------ */
{
id: 'glcm', ch: 8,
title: 'Texture: GLCM & Statistics',
sub: 'พื้นผิวคือลวดลายที่ซ้ำกัน วัดได้ด้วยสถิติของคู่พิกเซล (GLCM) และสถิติของฮิสโตแกรม',
desc: '5 แนวทางวิเคราะห์พื้นผิว, GLCM + 5 feature, mean/variance/skewness/kurtosis',
body: `
<p><strong>พื้นผิว (texture)</strong> คือ “ลวดลาย” (pattern) ที่ซ้ำ ๆ กันอย่างสม่ำเสมอทั่วทั้งภาพ บอกได้ว่าผิวเรียบ หยาบ หรือสม่ำเสมอ วัดด้วยความสัมพันธ์เชิงสถิติของพิกเซล นิยมใช้กับภาพทางการแพทย์ ภาพดาวเทียม และการแยกวัสดุ</p>

<h2>5 แนวทางวิเคราะห์พื้นผิว</h2>
<div class="tbl-wrap"><table class="tbl">
<tr><th>แนวทาง</th><th>แนวคิด</th><th>ตัวอย่าง</th></tr>
<tr><td>Statistical</td><td>ความสัมพันธ์เชิงสถิติของค่าพิกเซล</td><td>GLCM, Histogram-based (mean, variance, …)</td></tr>
<tr><td>Structural</td><td>มองพื้นผิวเป็นองค์ประกอบย่อยที่เรียงต่อกัน</td><td>Edge density, line / primitive pattern</td></tr>
<tr><td>Filter / Transform</td><td>แปลงภาพเข้าโดเมนความถี่หรือสเกล</td><td>Gabor filter, Wavelet, Fourier</td></tr>
<tr><td>Model-based</td><td>สร้างแบบจำลองทางสถิติของพื้นผิว</td><td>MRF (Markov Random Fields), Fractal model</td></tr>
<tr><td>Local Binary Pattern</td><td>เข้ารหัส texture รอบพิกเซลเป็นเลขฐานสอง</td><td>LBP</td></tr>
</table></div>

<h2>GLCM (Gray-Level Co-occurrence Matrix)</h2>
<p>คือการนับความถี่ที่คู่ระดับสี <strong>(i, j)</strong> เกิดขึ้นติดกัน ตาม<strong>ทิศทาง</strong>และ<strong>ระยะ</strong>ที่กำหนด ต้องกำหนด 2 อย่าง</p>
<ul><li><strong>ทิศทาง θ</strong> เช่น 0° (ขวา), 45°, 90°, 135°</li><li><strong>ระยะ d</strong> จำนวนพิกเซลที่ห่างกัน เช่น d = 1</li></ul>
<p>ขั้นตอน: (1) นับคู่พิกเซล (i, j) ที่ติดกันตามทิศ (2) บันทึกลงตาราง L×L เมื่อ L คือจำนวนระดับสี (3) normalize เป็นความน่าจะเป็น p(i, j) (4) คำนวณ feature</p>
<div class="fig" data-fig="glcm"></div>
<div class="eq"><span class="m">p(i, j) = GLCM(i, j) / จำนวนคู่ทั้งหมด</span></div>
<dl class="sym"><dt>i</dt><dd>แถว คือค่าของพิกเซลต้นทาง (ซ้าย เมื่อ θ = 0°)</dd><dt>j</dt><dd>คอลัมน์ คือค่าของเพื่อนบ้านตามทิศ (ขวา)</dd><dt>L</dt><dd>จำนวนระดับสี ตารางมีขนาด L×L</dd></dl>
<p>บางไลบรารีใช้ GLCM แบบสมมาตร คือนับทั้ง (i, j) และ (j, i) ทุกคู่ แต่ตัวอย่างในสไลด์นับทางเดียว</p>

<h3>5 feature จาก GLCM</h3>
<div class="tbl-wrap"><table class="tbl">
<tr><th>Feature</th><th>สูตร</th><th>ความหมาย</th></tr>
<tr><td>Contrast</td><td class="mono">Σ p(i,j)·(i−j)²</td><td>ความต่างของความเข้มระหว่างพิกเซลใกล้กัน ค่าสูง = texture แปรปรวนมาก</td></tr>
<tr><td>Homogeneity</td><td class="mono">Σ p(i,j) / (1+(i−j)²)</td><td>ความเหมือนกันของ texture (Inverse Difference Moment) ค่าสูง = เรียบเนียน ค่าต่ำ = หยาบ</td></tr>
<tr><td>Energy (ASM)</td><td class="mono">Σ p(i,j)²</td><td>ความสม่ำเสมอ (Angular Second Moment) ค่าสูง = มีรูปแบบซ้ำสม่ำเสมอ</td></tr>
<tr><td>Correlation</td><td class="mono">Σ (i−μᵢ)(j−μⱼ)p(i,j) / σᵢσⱼ</td><td>ความสัมพันธ์เชิงเส้นของ gray level บอกความสม่ำเสมอของ pattern ในทิศนั้น</td></tr>
<tr><td>Entropy</td><td class="mono">−Σ p(i,j)·log₂ p(i,j)</td><td>ความซับซ้อนหรือความสุ่ม ค่าสูง = texture ซับซ้อนมาก</td></tr>
</table></div>
<p>ผลของภาพ 4×4 ในสไลด์: Contrast 0.58 (ค่อนข้างเรียบ), Energy 0.17 (มีรูปแบบซ้ำอยู่บ้าง), Homogeneity 0.81 (พิกเซลข้างเคียงคล้ายกันมาก), Entropy 2.69 bit และ Correlation 0.80 (ระดับสีสัมพันธ์กันเป็นทิศทาง) สังเกตว่า Contrast กับ Homogeneity สวนทางกัน และ Energy กับ Entropy สวนทางกัน</p>
<p>การประยุกต์: <strong>ภาพแพทย์</strong> (คัดกรองโรคจอประสาทตาจากเบาหวาน วิเคราะห์เนื้อเยื่อเนื้องอกใน MRI, CT), <strong>ภาพดาวเทียม</strong> (จำแนกป่า เมือง น้ำ พื้นที่เกษตร), <strong>จำแนกวัสดุ</strong> (ไม้ โลหะ ผ้า หิน) และ<strong>ตรวจคุณภาพผิวชิ้นงาน</strong> (หาตำหนิ รอยขีดข่วนในสายการผลิต)</p>

<h2>Histogram-based statistics</h2>
<p>ใช้การกระจายค่าความเข้มของพิกเซลทั้งบริเวณ ได้ 4 ค่า</p>
<div class="tbl-wrap"><table class="tbl">
<tr><th>ค่า</th><th>สูตร</th><th>บอกอะไร</th></tr>
<tr><td>Mean μ</td><td class="mono">Σx / N</td><td>ความสว่างโดยรวม</td></tr>
<tr><td>Variance σ²</td><td class="mono">Σ(x−μ)² / N</td><td>ความหลากหลายของความเข้ม (contrast) ยิ่งสูงยิ่งหยาบ</td></tr>
<tr><td>Skewness</td><td class="mono">[Σ(x−μ)³/N] / σ³</td><td>ความเบ้ ความไม่สมมาตร ภาพโทนมืดหรือสว่าง</td></tr>
<tr><td>Kurtosis</td><td class="mono">[Σ(x−μ)⁴/N] / σ⁴</td><td>ความโด่ง ความสูงหรือเตี้ยของการแจกแจง</td></tr>
</table></div>
<div class="fig" data-fig="moments"></div>
<p>ใช้จำแนกพื้นผิวจากความสว่างหรือ contrast และตรวจหา defect บนพื้นผิว ข้อต่างสำคัญกับ GLCM: ค่าสถิติของ histogram เป็น<strong>สถิติอันดับหนึ่ง</strong> ดูพิกเซลทีละตัว ไม่รู้ว่าใครอยู่ติดใคร ส่วน GLCM เป็น<strong>สถิติอันดับสอง</strong> ดูคู่พิกเซลจึงรู้การจัดเรียงเชิงตำแหน่ง ภาพลายทางกับภาพจุดกระจายที่มีสัดส่วนสีเท่ากันจะมี mean และ variance เท่ากัน แต่ GLCM ต่างกัน</p>
`,
written: [
{ q: 'Texture (พื้นผิว) คืออะไร และวิธีวิเคราะห์พื้นผิวแบ่งได้เป็นกี่แนวทาง อะไรบ้าง พร้อมยกตัวอย่าง', a: `
<p>Texture คือลวดลาย (pattern) ที่ซ้ำ ๆ กันอย่างสม่ำเสมอทั่วทั้งภาพ บอกความเรียบ หยาบ หรือสม่ำเสมอ วัดด้วยความสัมพันธ์เชิงสถิติของพิกเซล แบ่งการวิเคราะห์เป็น 5 แนวทาง</p>
<ol><li><strong>Statistical</strong> ความสัมพันธ์เชิงสถิติของค่าพิกเซล เช่น GLCM, histogram-based</li>
<li><strong>Structural</strong> มองพื้นผิวเป็นองค์ประกอบย่อยเรียงกัน เช่น edge density, line pattern</li>
<li><strong>Filter/Transform</strong> แปลงเข้าโดเมนความถี่หรือสเกล เช่น Gabor, wavelet, Fourier</li>
<li><strong>Model-based</strong> สร้างแบบจำลองทางสถิติ เช่น MRF, fractal</li>
<li><strong>Local Binary Pattern</strong> เข้ารหัสรอบพิกเซลเป็นเลขฐานสอง เช่น LBP</li></ol>` },
{ q: 'GLCM คืออะไร ต้องกำหนดค่าอะไรบ้าง และมีขั้นตอนการสร้างอย่างไร', a: `
<p><strong>GLCM (Gray-Level Co-occurrence Matrix)</strong> คือเมทริกซ์ที่นับความถี่ของคู่ระดับสี (i, j) ที่อยู่ติดกันตามทิศทางและระยะที่กำหนด</p>
<p>ต้องกำหนด <strong>ทิศทาง θ</strong> (0°, 45°, 90°, 135°) และ <strong>ระยะ d</strong> (เช่น d = 1)</p>
<ol><li>นับคู่พิกเซล (i, j) ที่ติดกันตามทิศและระยะ ทุกคู่ในภาพ</li>
<li>บันทึกจำนวนลงตาราง L×L (L = จำนวนระดับสี) แถว i = ค่าพิกเซลต้นทาง คอลัมน์ j = ค่าเพื่อนบ้าน</li>
<li>Normalize เป็นความน่าจะเป็น p(i,j) = GLCM(i,j) / จำนวนคู่ทั้งหมด</li>
<li>คำนวณ feature เช่น contrast, homogeneity, energy, correlation, entropy</li></ol>` },
{ q: 'จงอธิบายความหมายของ feature ทั้ง 5 ที่ได้จาก GLCM และการแปลความหมายเมื่อค่าสูง', a: `
<ul><li><strong>Contrast</strong> Σp(i−j)² วัดความต่างของความเข้มระหว่างพิกเซลใกล้กัน ค่าสูง = texture แปรปรวน หยาบ</li>
<li><strong>Homogeneity</strong> Σp/(1+(i−j)²) วัดความเหมือนกัน ค่าสูง = เรียบเนียน ค่าต่ำ = หยาบ</li>
<li><strong>Energy (ASM)</strong> Σp² วัดความสม่ำเสมอ ค่าสูง = มีรูปแบบซ้ำสม่ำเสมอ คู่สีไม่กี่แบบครองภาพ</li>
<li><strong>Correlation</strong> วัดความสัมพันธ์เชิงเส้นของ gray level ค่าสูง = ระดับสีสัมพันธ์กันเป็นทิศทาง pattern สม่ำเสมอ</li>
<li><strong>Entropy</strong> −Σp log₂p วัดความซับซ้อน/ความสุ่ม ค่าสูง = texture ซับซ้อนมาก</li></ul>` },
{ q: 'ถ้าภาพพื้นผิว A มี Contrast ต่ำ Homogeneity สูง Energy สูง และ Entropy ต่ำ ส่วนภาพ B ตรงข้ามทั้งหมด จงวิเคราะห์ว่าพื้นผิวแต่ละภาพเป็นอย่างไร และยกตัวอย่างวัสดุ', tag: 'คิดวิเคราะห์', a: `
<p><strong>ภาพ A</strong> พิกเซลข้างเคียงมีค่าใกล้กัน (contrast ต่ำ homogeneity สูง) และมีคู่สีไม่กี่แบบซ้ำกันสม่ำเสมอ (energy สูง entropy ต่ำ) จึงเป็นพื้นผิวเรียบและสม่ำเสมอ เช่น โลหะขัดเงา กระจก พลาสติกเรียบ</p>
<p><strong>ภาพ B</strong> พิกเซลข้างเคียงต่างกันมาก คู่สีกระจายหลากหลายและสุ่ม จึงเป็นพื้นผิวหยาบ ซับซ้อน เช่น หิน คอนกรีต ผ้าขนสัตว์ หรือบริเวณป่าในภาพดาวเทียม</p>` },
{ q: 'Histogram-based texture feature มีอะไรบ้าง จงอธิบายความหมายของแต่ละตัว', a: `
<ul><li><strong>Mean</strong> ค่าเฉลี่ยความเข้ม วัดความสว่างโดยรวม</li>
<li><strong>Variance / Standard deviation</strong> ความแปรปรวน วัดความหลากหลายของความเข้มหรือ contrast ยิ่งสูง texture ยิ่งหยาบ</li>
<li><strong>Skewness</strong> ความเบ้ วัดความไม่สมมาตรของการแจกแจง ใช้บอกว่าภาพมีโทนมืดหรือสว่าง</li>
<li><strong>Kurtosis</strong> ความโด่ง วัดความสูงหรือความเตี้ยของการแจกแจงความเข้ม บอกว่าความเข้มกระจุกหรือกระจาย</li></ul>
<p>ใช้จำแนกพื้นผิวจากความสว่างหรือ contrast และตรวจหา defect บนพื้นผิว</p>` },
{ q: 'จงอธิบายการแปลความหมายของค่า Skewness และ Kurtosis ต่อพื้นผิว', a: `
<p><strong>Skewness</strong></p>
<ul><li>= 0 การกระจายสมมาตร ความเข้มสมดุล</li><li>> 0 (บวก) หางยาวทางขวา พิกเซลส่วนใหญ่มีค่าต่ำ พื้นผิวส่วนใหญ่ “มืด”</li><li>< 0 (ลบ) หางยาวทางซ้าย พิกเซลส่วนใหญ่มีค่าสูง พื้นผิวส่วนใหญ่ “สว่าง”</li></ul>
<p><strong>Kurtosis</strong></p>
<ul><li>= 3 การกระจายแบบ normal</li><li>> 3 การกระจายแหลม ความเข้มกระจุกตัว texture เรียบ สม่ำเสมอ</li><li>< 3 การกระจายแบน ความเข้มกระจายหลากหลาย texture หยาบ</li></ul>` },
{ q: 'GLCM กับ Histogram-based statistics ต่างกันอย่างไร ทำไมบางกรณีต้องใช้ GLCM', tag: 'คิดวิเคราะห์', a: `
<p>Histogram-based เป็นสถิติอันดับหนึ่ง (first-order) คิดจากค่าของพิกเซลแต่ละตัว ไม่รู้ว่าพิกเซลไหนอยู่ติดกับพิกเซลไหน ส่วน GLCM เป็นสถิติอันดับสอง (second-order) นับคู่พิกเซลตามทิศและระยะ จึงรู้ความสัมพันธ์เชิงตำแหน่งของลวดลาย</p>
<p>ตัวอย่าง: ภาพลายทางขาวดำสลับกัน กับภาพที่จุดขาวดำกระจายแบบสุ่ม ถ้ามีสัดส่วนขาวดำเท่ากัน จะได้ mean, variance เท่ากัน แยกไม่ได้ แต่ GLCM ต่างกันชัดเจน ภาพลายทางมีคู่ที่ซ้ำเป็นระเบียบ (energy สูง) ภาพสุ่มมี entropy สูง จึงต้องใช้ GLCM เมื่อต้องการแยกพื้นผิวที่ต่างกันที่การจัดเรียง</p>` },
{ q: 'จงยกตัวอย่างการประยุกต์ใช้ GLCM ในงานจริงอย่างน้อย 3 ด้าน', a: `
<ul><li><strong>Medical</strong> คัดกรองโรคจอประสาทตาจากเบาหวานอัตโนมัติ วิเคราะห์เนื้อเยื่อเนื้องอกจาก texture ใน MRI, CT</li>
<li><strong>Satellite / Remote sensing</strong> จำแนกพื้นที่ ป่า เมือง น้ำ พื้นที่เกษตร จากลวดลายพื้นผิว</li>
<li><strong>Material</strong> แยกไม้ โลหะ ผ้า หิน จากความหยาบและลวดลาย</li>
<li><strong>Quality control</strong> หาตำหนิ รอยขีดข่วนบนผิวชิ้นงานในสายการผลิต</li></ul>` },
],
mcq: [
{ q: 'GLCM ทิศ 0°, d = 1 ภาพแถวหนึ่งเป็น [0, 0, 1, 1] จะได้คู่ใดบ้าง', o: ['(0,0), (0,1), (1,1)', '(0,0), (1,1)', '(0,1), (1,0)', '(0,0), (0,0), (1,1), (1,1)'], a: 0, why: 'เลื่อนไปทางขวาทีละ 1 ได้ 3 คู่ คือ 0→0, 0→1 และ 1→1' },
{ q: 'ภาพ 4×4 ใช้ GLCM ทิศ 0°, d = 1 มีคู่ทั้งหมดกี่คู่', o: ['9', '12', '16', '24'], a: 1, why: 'แต่ละแถวมี 3 คู่ × 4 แถว = 12 คู่ จึง normalize ด้วยการหาร 12' },
{ q: 'Feature ใดของ GLCM ที่ค่าสูงหมายถึง texture ซับซ้อนหรือสุ่มมาก', o: ['Energy', 'Homogeneity', 'Entropy', 'Correlation'], a: 2, why: 'Entropy วัดความซับซ้อนหรือความสุ่ม ส่วน energy สูงหมายถึงสม่ำเสมอ' },
{ q: 'Homogeneity อีกชื่อหนึ่งคือ', o: ['Angular Second Moment', 'Inverse Difference Moment', 'Second-order entropy', 'Cross correlation'], a: 1, why: 'Homogeneity = Inverse Difference Moment ส่วน Energy = Angular Second Moment' },
{ q: 'Skewness มากกว่า 0 แปลว่าอะไร', o: ['หางยาวทางซ้าย พื้นผิวส่วนใหญ่สว่าง', 'หางยาวทางขวา พื้นผิวส่วนใหญ่มืด', 'การกระจายแหลม', 'การกระจายสมมาตร'], a: 1, why: 'Positive skew หางยาวทางขวา ค่าสูงกระจายออกไป แต่พิกเซลส่วนใหญ่อยู่ฝั่งค่าต่ำ จึงมืด' },
{ q: 'Kurtosis < 3 บอกอะไรเกี่ยวกับ texture', o: ['เรียบ สม่ำเสมอ', 'หยาบ ความเข้มกระจายหลากหลาย', 'มืดเกือบทั้งภาพ', 'ไม่มีขอบ'], a: 1, why: 'Kurtosis ต่ำกว่า 3 คือการกระจายแบน ความเข้มกระจายหลากหลาย texture หยาบ' },
{ q: 'Gabor filter และ Wavelet จัดอยู่ในแนวทางวิเคราะห์พื้นผิวแบบใด', o: ['Statistical', 'Structural', 'Filter / Transform', 'Model-based'], a: 2, why: 'แปลงภาพเข้าโดเมนความถี่หรือสเกล จึงเป็น filter/transform' },
{ q: 'MRF (Markov Random Fields) จัดเป็นแนวทางใด', o: ['Model-based', 'Structural', 'LBP', 'Statistical'], a: 0, why: 'MRF และ fractal เป็นการสร้างแบบจำลองทางสถิติของพื้นผิว' },
],
},

/* ------------------------------------------------------------------ */
{
id: 'lbp', ch: 8,
title: 'Edge Density & LBP',
sub: 'พื้นผิวแบบโครงสร้าง (นับขอบ) และ Local Binary Pattern ที่เข้ารหัสรอบพิกเซลเป็นเลขฐานสอง',
desc: 'Edge density แบบ binary กับ weighted, การตีความวัสดุ, LBP 4 ขั้น, ทำไมทนแสง',
body: `
<h2>Edge density</h2>
<p>คือการวัด<strong>จำนวนและความหนาแน่นของขอบ</strong>ในภาพ ซึ่งสะท้อนความซับซ้อนและโครงสร้างของพื้นผิววัสดุ เป็นวิธีแบบ structural หาขอบด้วย Sobel, Canny, Prewitt หรือ Roberts cross-gradient มี 2 แบบ</p>
<div class="eq"><span class="m">Binary = จำนวน edge pixels / จำนวน pixels ทั้งหมด</span><p>พิกเซลที่ |G| เกิน threshold นับเป็นขอบ ได้ค่า 0 ถึง 1</p></div>
<div class="eq"><span class="m">Weighted = Σ |G| / พื้นที่ภาพ</span><p>รวมความแรงของขอบทุกพิกเซล ขอบชัดมีน้ำหนักมากกว่า</p></div>
<dl class="sym"><dt>|G|</dt><dd>magnitude ของ gradient = √(Gx² + Gy²)</dd><dt>พื้นที่ภาพ</dt><dd>จำนวนพิกเซลทั้งหมด เช่น 20×20 = 400</dd></dl>
<p>ตัวอย่างในสไลด์ ภาพ 20×20 มีพิกเซลที่ |G| เกิน 25 อยู่ 85 พิกเซล และผลรวม magnitude 3250 ได้ binary = 85/400 = 0.2125 (21.25%) และ weighted = 3250/400 = 8.125</p>
<div class="tbl-wrap"><table class="tbl">
<tr><th>Binary</th><th>วัสดุ</th></tr>
<tr><td>0.1–0.3</td><td>โลหะเรียบ (low)</td></tr>
<tr><td>0.3–0.6</td><td>ไม้ (medium)</td></tr>
<tr><td>0.4–0.7</td><td>ผ้าทอ (medium-high)</td></tr>
<tr><td>0.6–0.9</td><td>หิน คอนกรีต (high)</td></tr>
</table></div>
<div class="tbl-wrap"><table class="tbl">
<tr><th>Weighted</th><th>ลักษณะพื้นผิว</th></tr>
<tr><td>0–2</td><td>เรียบมาก: กระจก โลหะขัดมัน พลาสติกเงา</td></tr>
<tr><td>2–6</td><td>ค่อนข้างเรียบ: โลหะทั่วไป พลาสติกด้าน หนังเรียบ</td></tr>
<tr><td>6–12</td><td>ปานกลาง: ไม้ ผ้าทอธรรมดา กระดาษ มี pattern ชัด</td></tr>
<tr><td>12–20</td><td>มี texture เด่น: ผ้าขนสัตว์ โลหะขัดหยาบ ไม้หยาบ</td></tr>
<tr><td>20+</td><td>หยาบมาก: หิน คอนกรีต กระดาษทราย หรือมีข้อบกพร่อง</td></tr>
</table></div>
<p>Binary บอกแค่ว่ามีขอบ “มากแค่ไหน” ส่วน weighted บอกด้วยว่าขอบ “แรงแค่ไหน” ภาพที่มีขอบจาง ๆ จำนวนมากกับภาพที่มีขอบคมจำนวนเท่ากันจึงแยกได้ด้วย weighted</p>

<h2>Local Binary Pattern (LBP)</h2>
<p>เทคนิคสกัด texture โดย<strong>เปรียบเทียบความเข้มของพิกเซลกับพิกเซลข้างเคียง</strong> แล้วแปลงเป็น binary code ได้ local texture descriptor ที่<strong>ทนทานต่อการเปลี่ยนแปลงของแสง</strong></p>
<div class="fig" data-fig="lbp"></div>
<ol>
<li>เลือก center pixel และ neighbors 8 ตัวรอบ ๆ</li>
<li>เปรียบเทียบ neighbor แต่ละตัวกับ center: ถ้า neighbor ≥ center ให้ 1 ถ้าน้อยกว่าให้ 0</li>
<li>อ่าน binary pattern ตามเข็มนาฬิกา</li>
<li>แปลง binary เป็นเลขฐานสิบ ได้ค่า LBP ของพิกเซลนั้น (0 ถึง 255)</li>
</ol>
<p>สไลด์เขียน pattern เป็น 10111011 = 187 แต่ถ้าเริ่มที่มุมซ้ายบนแล้วเวียนตามเข็มนาฬิกาครบรอบจริง ๆ จะได้ 10111101 = 189 ตอนสอบให้เขียนบอกจุดเริ่มและทิศที่อ่านให้ชัดทุกครั้ง</p>
<p>ทำซ้ำกับทุกพิกเซลจะได้ภาพ LBP จากนั้นนับ <strong>histogram ของค่า LBP</strong> (256 bins) เป็น feature vector ของพื้นผิว</p>
<div class="key">ถ้าภาพสว่างขึ้นทั้งบริเวณ พิกเซลทุกตัวเพิ่มขึ้นเท่า ๆ กัน ผลการเปรียบเทียบ “มากกว่าหรือน้อยกว่า center” จึงไม่เปลี่ยน LBP จึงทนต่อแสง</div>
<p>การประยุกต์: จดจำและตรวจจับใบหน้า วิเคราะห์สีหน้าและอารมณ์ จำแนกพื้นผิวและวัสดุ และภาพแพทย์ (เนื้อเยื่อ)</p>
`,
written: [
{ q: 'Edge density คืออะไร คำนวณได้กี่แบบ แต่ละแบบต่างกันอย่างไร', a: `
<p>Edge density คือการวัดจำนวนและความหนาแน่นของขอบในภาพ สะท้อนความซับซ้อนและโครงสร้างของพื้นผิว (เป็นวิธีแบบ structural) หาขอบด้วย Sobel, Canny, Prewitt หรือ Roberts</p>
<ul><li><strong>Binary</strong> = จำนวน edge pixels ÷ จำนวนพิกเซลทั้งหมด โดยพิกเซลที่ |G| เกิน threshold นับเป็นขอบ บอกว่าขอบมีมากแค่ไหน</li>
<li><strong>Weighted</strong> = Σ|G| ÷ พื้นที่ภาพ รวมความแรงของขอบ บอกทั้งปริมาณและความคมของขอบ</li></ul>
<p>ค่ายิ่งสูง พื้นผิวยิ่งหยาบหรือซับซ้อน</p>` },
{ q: 'จงแปลความหมายของค่า Edge density ต่อชนิดของวัสดุ ถ้าได้ binary = 0.2 และ weighted = 22 ควรเป็นวัสดุแบบใด', tag: 'คิดวิเคราะห์', a: `
<p>Binary: โลหะเรียบ 0.1–0.3, ไม้ 0.3–0.6, ผ้าทอ 0.4–0.7, หิน/คอนกรีต 0.6–0.9</p>
<p>Weighted: 0–2 เรียบมาก (กระจก), 2–6 ค่อนข้างเรียบ, 6–12 ปานกลาง (ไม้ ผ้า กระดาษ), 12–20 texture เด่น, 20+ หยาบมาก (หิน คอนกรีต กระดาษทราย) หรือมีข้อบกพร่อง</p>
<p>ค่า binary 0.2 บอกว่ามีพิกเซลขอบไม่มาก แต่ weighted 22 สูงมาก แปลว่าขอบที่มีอยู่นั้นแรงมาก จึงน่าจะเป็นผิวเรียบที่มีรอยขีดข่วนหรือตำหนิที่คมชัด เช่น โลหะเรียบที่มีรอยแตก เป็นเหตุผลที่ควรดูทั้งสองค่าร่วมกัน</p>` },
{ q: 'Local Binary Pattern (LBP) คืออะไร จงอธิบายขั้นตอนการคำนวณ', a: `
<p>LBP คือเทคนิคสกัด texture feature โดยเปรียบเทียบความเข้มของพิกเซลกลางกับพิกเซลข้างเคียง แล้วแปลงผลเป็นรหัสเลขฐานสอง ได้ local texture descriptor ที่ทนต่อการเปลี่ยนแปลงของแสง</p>
<ol><li>เลือก center pixel และ 8 neighbors รอบ ๆ (หน้าต่าง 3×3)</li>
<li>เปรียบเทียบ: neighbor ≥ center ให้ 1, neighbor < center ให้ 0</li>
<li>อ่าน 8 บิตเรียงตามเข็มนาฬิกาจากจุดเริ่มที่กำหนด</li>
<li>แปลงเลขฐานสองเป็นฐานสิบ เป็นค่า LBP ของพิกเซลนั้น</li></ol>
<p>ทำทุกพิกเซลแล้วนำค่า LBP มาทำ histogram เป็น feature vector ของพื้นผิว</p>` },
{ q: 'ทำไม LBP จึงทนทานต่อการเปลี่ยนแปลงของแสง', a: `
<p>เพราะ LBP ใช้เพียงผลการเปรียบเทียบว่า neighbor มากกว่าหรือเท่ากับ center หรือไม่ ไม่ได้ใช้ค่าความเข้มจริง เมื่อแสงเปลี่ยนแบบทั้งบริเวณ (เช่น สว่างขึ้นทุกพิกเซล 30 หรือคูณด้วยค่าคงที่) ลำดับมากน้อยระหว่างพิกเซลยังเหมือนเดิม บิตที่ได้จึงไม่เปลี่ยน ค่า LBP และ histogram จึงคงเดิม</p>` },
{ q: 'จงยกตัวอย่างการประยุกต์ใช้ LBP อย่างน้อย 3 งาน', a: `
<ul><li>จดจำและตรวจจับใบหน้า (face recognition/detection)</li><li>วิเคราะห์สีหน้าและอารมณ์</li><li>จำแนกพื้นผิวและวัสดุ</li><li>วิเคราะห์ภาพทางการแพทย์ เช่น เนื้อเยื่อ</li></ul>` },
{ q: 'Edge density กับ LBP ต่างจากการวิเคราะห์แบบ GLCM อย่างไร (บอกว่าแต่ละวิธีอยู่ในแนวทางใด)', tag: 'เปรียบเทียบ', a: `
<ul><li><strong>GLCM</strong> แนวทาง statistical นับความถี่ของคู่ระดับสีตามทิศและระยะ แล้วคำนวณสถิติ เช่น contrast, entropy</li>
<li><strong>Edge density</strong> แนวทาง structural มองพื้นผิวเป็นโครงสร้างของขอบ วัดปริมาณหรือความแรงของขอบต่อพื้นที่</li>
<li><strong>LBP</strong> แนวทาง local binary pattern เข้ารหัสรูปแบบรอบพิกเซลเป็นเลขฐานสอง แล้วใช้ histogram ของรหัส ทนต่อแสงได้ดีที่สุดในสามวิธี</li></ul>` },
],
mcq: [
{ q: 'ภาพ 20×20 มี edge pixels 85 จุด Edge density แบบ binary เท่ากับเท่าใด', o: ['0.085', '0.2125', '4.25', '8.125'], a: 1, why: '85 ÷ 400 = 0.2125 หรือ 21.25% ส่วน 8.125 คือแบบ weighted จากผลรวม magnitude 3250' },
{ q: 'Edge density แบบ weighted ใช้อะไรเป็นตัวตั้ง', o: ['จำนวน edge pixels', 'ผลรวม |G| ของพิกเซล', 'จำนวน contour', 'ค่าเฉลี่ยความเข้ม'], a: 1, why: 'Weighted = Σ|G| ÷ พื้นที่ภาพ' },
{ q: 'Edge density แบบ binary ประมาณ 0.75 น่าจะเป็นวัสดุใด', o: ['โลหะเรียบ', 'ไม้', 'หินหรือคอนกรีต', 'กระจก'], a: 2, why: 'หิน/คอนกรีตอยู่ในช่วง 0.6–0.9 (high edge density)' },
{ q: 'ใน LBP ถ้า neighbor = center จะให้บิตใด', o: ['0', '1', 'ข้ามพิกเซลนั้น', 'X'], a: 1, why: 'กฎคือ neighbor ≥ center ให้ 1 จึงรวมกรณีเท่ากันด้วย' },
{ q: 'ค่า LBP ของพิกเซลหนึ่ง (8 neighbors) อยู่ในช่วงใด', o: ['0–8', '0–127', '0–255', '−128–127'], a: 2, why: '8 บิตแทนเลขฐานสิบได้ 0 ถึง 255' },
{ q: 'Binary pattern 10111011 เท่ากับเลขฐานสิบเท่าใด', o: ['171', '187', '189', '219'], a: 1, why: '128 + 32 + 16 + 8 + 2 + 1 = 187' },
{ q: 'Edge density จัดอยู่ในแนวทางวิเคราะห์พื้นผิวแบบใด', o: ['Statistical', 'Structural', 'Model-based', 'Filter / Transform'], a: 1, why: 'Structural มองพื้นผิวเป็นองค์ประกอบย่อย สไลด์จัด edge density และ line pattern ไว้ที่นี่' },
],
},

/* ------------------------------------------------------------------ */
{
id: 'local', ch: 8,
title: 'Local Features',
sub: 'หาจุดเด่น (keypoints) แทนการมองทั้งภาพ เพื่อจับคู่ภาพที่ต่างมุม ต่างขนาด และเลือก feature ให้เหมาะกับงาน',
desc: 'Keypoint + descriptor, SIFT, Harris, SURF, BRIEF, FAST, ORB, งานที่ใช้ และตารางเลือก feature',
body: `
<p><strong>Local feature</strong> คือคุณลักษณะที่ได้จากเฉพาะบริเวณพื้นที่หนึ่งของภาพ แทนที่จะมองทั้งภาพ วิธีนี้หา<strong>จุดสนใจ (keypoints)</strong> ที่โดดเด่น แล้วอธิบายบริเวณรอบจุดนั้น ทำให้<strong>ทนต่อการย่อ ขยาย หมุน ย้ายตำแหน่ง และเปลี่ยนมุมมอง</strong> และวิเคราะห์ภาพได้แม่นยำขึ้น</p>
<p>มีสองส่วนเสมอ: <strong>detector</strong> หาว่าจุดเด่นอยู่ตรงไหน และ <strong>descriptor</strong> แปลงบริเวณรอบจุดเป็นเวกเตอร์ แล้วจับคู่จุดระหว่างสองภาพด้วยระยะห่างของเวกเตอร์</p>
<div class="fig" data-fig="keypoints"></div>

<h2>วิธีที่ต้องรู้จัก</h2>
<div class="tbl-wrap"><table class="tbl">
<tr><th>วิธี</th><th>แนวคิดย่อ</th></tr>
<tr><td>HOG</td><td>Histogram ของทิศ gradient ในแต่ละ cell (บทก่อนหน้า)</td></tr>
<tr><td>SIFT</td><td>Scale Invariant Feature Transform หา keypoint ในหลายสเกล กำหนดทิศหลักให้แต่ละจุด แล้วสร้าง descriptor 128 มิติ ทนต่อการย่อขยายและการหมุน แต่คำนวณช้า</td></tr>
<tr><td>Harris</td><td>Harris Corner Detection หามุม คือจุดที่ความเข้มเปลี่ยนมากเมื่อเลื่อนหน้าต่างไปทุกทิศ ทนการหมุน แต่ไม่ทนการย่อขยาย</td></tr>
<tr><td>SURF</td><td>Speeded-Up Robust Features แนวคิดคล้าย SIFT แต่ใช้ box filter และ integral image จึงเร็วกว่า</td></tr>
<tr><td>BRIEF</td><td>Binary Robust Independent Elementary Features descriptor แบบเลขฐานสอง จากการเทียบความเข้มของคู่พิกเซลสุ่ม เร็วและเล็ก</td></tr>
<tr><td>FAST</td><td>Features from Accelerated Segment Test หามุมเร็วมาก โดยดูพิกเซลบนวงกลมรอบจุดว่ามีช่วงติดกันที่สว่างหรือมืดกว่าจุดกลางมากพอหรือไม่</td></tr>
<tr><td>ORB</td><td>Oriented FAST and Rotated BRIEF ใช้ FAST หาจุด และ BRIEF ที่หมุนตามทิศของจุด ได้ความเร็วสูงและทนการหมุน ใช้งานได้ฟรี</td></tr>
</table></div>

<h2>งานที่ใช้ local features</h2>
<ol>
<li><strong>Panorama stitching</strong> จับคู่จุดเด่นระหว่างภาพที่ซ้อนกัน แล้วต่อเป็นภาพพาโนรามา</li>
<li><strong>3D Reconstruction (SfM)</strong> กู้โครงสร้าง 3 มิติจากภาพหลายมุมมอง</li>
<li><strong>SLAM / AR</strong> ระบุตำแหน่งกล้องและสร้างแผนที่ ใช้ในหุ่นยนต์และ AR/VR</li>
<li><strong>Object recognition</strong> จับคู่ local features เพื่อรู้จำวัตถุแม้มุมหรือแสงต่างกัน</li>
</ol>

<h2>เลือก feature ให้ตรงงาน</h2>
<div class="tbl-wrap"><table class="tbl">
<tr><th>งานเน้น</th><th>Feature ที่เหมาะ</th></tr>
<tr><td>สี / ค้นภาพ</td><td>Color histogram, color moments</td></tr>
<tr><td>รูปทรง / ขอบ</td><td>Hough, chain code, HOG, moments</td></tr>
<tr><td>ลวดลายพื้นผิว</td><td>GLCM, histogram stats, LBP</td></tr>
<tr><td>จับคู่ ต่อภาพ มุมต่างกัน</td><td>Local features: SIFT, ORB</td></tr>
<tr><td>งานซับซ้อน ข้อมูลมหาศาล</td><td>Deep features (CNN) ที่โมเดลเรียนรู้เอง</td></tr>
</table></div>
`,
written: [
{ q: 'Local feature คืออะไร มีข้อดีอย่างไรเมื่อเทียบกับ global feature', a: `
<p>Local feature คือคุณลักษณะที่ได้จากเฉพาะบริเวณของภาพ โดยหาจุดเด่น (keypoint) เช่น มุมหรือจุดตัดของขอบ แล้วสร้าง descriptor อธิบายบริเวณรอบจุดนั้น</p>
<p>ข้อดี: ทนต่อการย่อ ขยาย หมุน และย้ายตำแหน่งของวัตถุ ทนต่อการบังบางส่วนและพื้นหลังรก เพราะแม้บางจุดหายไป จุดที่เหลือยังจับคู่ได้ จึงวิเคราะห์ภาพได้แม่นยำกว่า global feature ที่สรุปทั้งภาพเป็นค่าเดียว</p>` },
{ q: 'จงยกตัวอย่างวิธีสกัด local feature อย่างน้อย 4 วิธี พร้อมอธิบายสั้น ๆ', a: `
<ul><li><strong>SIFT</strong> หา keypoint หลายสเกล ทนต่อการย่อขยายและหมุน descriptor 128 มิติ</li>
<li><strong>Harris corner</strong> หามุมจากการเปลี่ยนแปลงความเข้มเมื่อเลื่อนหน้าต่างทุกทิศ</li>
<li><strong>SURF</strong> คล้าย SIFT แต่เร็วกว่าด้วย box filter และ integral image</li>
<li><strong>FAST</strong> หามุมเร็วมากด้วยการทดสอบพิกเซลบนวงกลมรอบจุด</li>
<li><strong>BRIEF</strong> descriptor แบบไบนารีจากการเทียบคู่พิกเซล</li>
<li><strong>ORB</strong> รวม FAST กับ BRIEF ที่หมุนตามทิศ เร็วและทนการหมุน</li>
<li><strong>HOG</strong> histogram ของทิศ gradient ในแต่ละ cell</li></ul>` },
{ q: 'จงยกตัวอย่างการใช้งาน local feature อย่างน้อย 3 งาน และอธิบายว่าใช้ local feature อย่างไร', a: `
<ul><li><strong>Panorama stitching</strong> หาจุดเด่นที่ตรงกันในบริเวณที่ภาพซ้อนกัน แล้วใช้คู่จุดนั้นคำนวณการบิดภาพเพื่อต่อเป็นภาพเดียว</li>
<li><strong>3D reconstruction (Structure from Motion)</strong> จับคู่จุดเดียวกันจากหลายมุมกล้อง แล้วคำนวณตำแหน่ง 3 มิติ</li>
<li><strong>SLAM / AR</strong> ติดตามจุดเด่นระหว่างเฟรมเพื่อรู้ตำแหน่งกล้องและสร้างแผนที่ ใช้ในหุ่นยนต์และ AR/VR</li>
<li><strong>Object recognition</strong> จับคู่ local features ของวัตถุต้นแบบกับภาพ ทำให้รู้จำได้แม้มุมหรือแสงต่างกัน</li></ul>` },
{ q: 'ถ้าต้องการสร้างระบบต่อไปนี้ ควรเลือก feature แบบใด เพราะอะไร: (ก) ค้นหาเสื้อผ้าที่สีคล้ายกัน (ข) ตรวจหาเหรียญในภาพ (ค) แยกชนิดของเนื้อผ้า (ง) ต่อภาพพาโนรามา', tag: 'คิดวิเคราะห์', a: `
<ul><li><strong>(ก)</strong> Color histogram หรือ color moments เพราะเน้นการกระจายของสี คำนวณเร็ว ไม่ขึ้นกับท่าทางของเสื้อ</li>
<li><strong>(ข)</strong> Hough circle transform เพราะเหรียญมีรูปทรงวงกลมที่เขียนเป็นสมการได้</li>
<li><strong>(ค)</strong> Texture feature เช่น GLCM, LBP หรือ edge density เพราะเนื้อผ้าต่างกันที่ลวดลายและความหยาบ</li>
<li><strong>(ง)</strong> Local features เช่น SIFT หรือ ORB เพราะต้องจับคู่จุดเดียวกันระหว่างภาพที่มุมต่างกัน</li></ul>` },
{ q: 'Detector และ Descriptor ใน local feature ต่างกันอย่างไร ยกตัวอย่างวิธีที่ทำหน้าที่แต่ละอย่าง', a: `
<p><strong>Detector</strong> ทำหน้าที่หาตำแหน่งของจุดเด่นในภาพ เช่น Harris, FAST</p>
<p><strong>Descriptor</strong> ทำหน้าที่อธิบายบริเวณรอบจุดเด่นให้เป็นเวกเตอร์ตัวเลข เพื่อนำไปจับคู่หรือเปรียบเทียบ เช่น BRIEF</p>
<p>บางวิธีทำได้ทั้งสองอย่าง เช่น SIFT, SURF และ ORB (ORB ใช้ FAST เป็น detector และ BRIEF ที่หมุนตามทิศเป็น descriptor)</p>` },
],
mcq: [
{ q: 'ORB ประกอบจากวิธีใด', o: ['SIFT + SURF', 'FAST + BRIEF', 'Harris + HOG', 'HOG + SVM'], a: 1, why: 'ORB = Oriented FAST and Rotated BRIEF' },
{ q: 'จุดเด่นของ SIFT คือ', o: ['ทนต่อการย่อขยายและการหมุน', 'เร็วที่สุด', 'ใช้ได้เฉพาะภาพสี', 'ไม่ต้องหา keypoint'], a: 0, why: 'ชื่อเต็มคือ Scale Invariant Feature Transform จุดแข็งคือทนสเกลและการหมุน แต่ช้า' },
{ q: 'งานใดเหมาะกับ local features มากที่สุด', o: ['จำแนกฉากทะเลกับป่า', 'ต่อภาพพาโนรามา', 'วัดความสว่างเฉลี่ย', 'หาเส้นตรงในภาพ'], a: 1, why: 'Panorama ต้องจับคู่จุดเดียวกันระหว่างภาพที่ซ้อนกัน' },
{ q: 'ถ้างานซับซ้อนและมีข้อมูลมหาศาล ตารางเลือก feature แนะนำอะไร', o: ['Chain code', 'GLCM', 'Deep features (CNN)', 'Color moments'], a: 2, why: 'CNN เรียนรู้ feature เองจากข้อมูลจำนวนมาก' },
{ q: 'SLAM ใช้ local feature เพื่อทำอะไร', o: ['ลด noise', 'ระบุตำแหน่งกล้องและสร้างแผนที่', 'ทำ histogram equalization', 'แยกพื้นหลัง'], a: 1, why: 'SLAM = Simultaneous Localization and Mapping ใช้ในหุ่นยนต์และ AR/VR' },
{ q: 'Harris corner detector หาอะไร', o: ['วงกลม', 'มุม', 'สี', 'พื้นผิว'], a: 1, why: 'Harris หาจุดมุม คือจุดที่ความเข้มเปลี่ยนมากในทุกทิศ' },
],
},

]);

let userName = document.getElementById('userName'); //이름 입력창
let parts = document.getElementById('part'); //부서 입력창
let position = document.getElementById('position'); //직책 입력창
let join = document.getElementById('join'); //입사일 입력창
let email = document.getElementById('email'); //이메일 입력창
let tableBody = document.getElementById('tBody'); //테이블바디
let register = document.getElementById('register'); //등록버튼
let initBtn = document.getElementById('initBtn'); //초기화버튼
let refresh = document.getElementById('refresh'); //새로고침버튼
let update = document.getElementById('update'); //수정완료버튼
let cancel = document.getElementById('cancel'); //취소 버튼
let search = document.getElementById('search'); //검색 버튼
let find = document.getElementById('find'); //검색어 입력창
let memberId = document.getElementById('memberId'); //수정한 객체 pk값
let count = 1;
let members = []; 
let findMember = []; 
let id = 0; 
let changeMember;

//근속연수 계산하는 함수
function calcDay(join) {
    let nowDay = new Date();
    let joinDay = new Date(join);

    let toNowDay = nowDay.getTime();
    let toJoinDay = joinDay.getTime();
    let passTime = toNowDay - toJoinDay;

    let passDay = Math.round(passTime / (1000 * 60 * 60 * 24));
    return passDay;
}

// 리셋시 지워지지 않게 하는 이벤트
if (localStorage.length > 0) {
    members = JSON.parse(localStorage.getItem('members'));
    for (let i = 0; i < members.length; i++) {
        let passDay = calcDay(members[i]['join']);
        let memberInfo = `<tr><td>${i + 1}</td><td>${members[i]['name']}</td>
                        <td>${members[i]['part']}</td><td>${members[i]['position']}</td>
                        <td>${members[i]['join']}</td><td>${passDay}일</td><td>${members[i]['email']}</td>
                        <td><button class='revise' data-id='${id}'>수정</button></td>
                        <td><button class='delete' data-id='${id}'>삭제</button></td></tr>`;
                        tableBody.innerHTML += memberInfo;
                        id++;
    };
}
//수정 취소 버튼
cancel.addEventListener('click', () => {
    location.reload();
});

//수정 클릭시 등록 버튼 ->수정완료 버튼 바뀌는 함수
function changeText() {
    if (!revise_f()) {
        register.classList.toggle('none');
        update.classList.toggle('none');
        cancel.classList.toggle('none');
    }
};

//삭제 이벤트 함수
function delete_f() {
    const delRow = document.getElementsByClassName('delete');
    for (let i = 0; i < delRow.length; i++) { 
        delRow[i].addEventListener('click', (event) => { 
            const delTarget = event.target;
            delTarget.parentNode.parentNode.remove(); //tr->td로 들어가 삭제
            let delNumber = delTarget.dataset.id;
            members = members.filter((ele) => {
                return delNumber !== String(ele['id']); // !== 값과 타입이 모두 같지 않음
            });
            localStorage.setItem('members', JSON.stringify(members));
        });
    }
};

//수정 이벤트 함수
function revise_f() {
    const changeBtn = document.getElementsByClassName('revise'); 
    for (let i = 0; i < changeBtn.length; i++) {
        changeBtn[i].addEventListener('click', (event) => {
            const changeTarget = event.target;
            let changeNum = changeTarget.dataset.id; 
            changeMember = members.filter((ele) => {
                return changeNum === String(ele['id']);
            });
            userName.value = members[i]['name'],
            part.value = members[i]['part'],
            position.value = members[i]['position'],
            join.value = members[i]['join'],
            email.value = members[i]['email'];
            memberId.value = members[i]['id'];
            changeText();
        });
    }
};

//검색한 객체에서 수정하기
function searchMem() {
    const changeBtn = document.getElementsByClassName('revise');
    for (let i = 0; i < changeBtn.length; i++) {
        changeBtn[i].addEventListener('click', (event) => {
            const changeTarget = event.target;
            let changeNum = changeTarget.dataset.id; 
            changeMember = findMember.filter((ele) => {
                return changeNum === String(ele['id']);
            });
            userName.value = findMember[i]['name'],
            part.value = findMember[i]['part'],
            position.value = findMember[i]['position'],
            join.value = findMember[i]['join'],
            email.value = findMember[i]['email'];
            memberId.value = findMember[i]['id'];
            changeText();
        });
    }
};

// 등록 이벤트
register.addEventListener('click', () => {
    let memberSize = members.length;
    const name = userName.value;
    const part = parts.value;
    const positions = position.value;
    const joind = join.value;
    const passDay = calcDay(joind);
    const emails = email.value;
    members.push({
        id: id,
        name: userName.value,
        part: parts.value,
        position: position.value,
        join: join.value,
        email: email.value
    });
    const userInfo = `<tr><td>${memberSize + 1}</td><td>${name}</td><td>${part}</td>
        <td>${positions}</td><td>${joind}</td><td>${passDay}일</td><td>${emails}</td>
        <td><button class ='revise' data-number='${id}'>수정</button></td>
        <td><button class ='delete' data-id='${id}'>삭제</button></td></tr>`;
        tableBody.innerHTML += userInfo;

    id++;
    delete_f();
    revise_f();
    document.getElementById('form1').reset();
    localStorage.setItem('members', JSON.stringify(members));
});

delete_f(); //삭제 이벤트
revise_f(); //수정 이벤트

//초기화 이벤트
initBtn.addEventListener('click', () => {
    localStorage.clear();
    location.reload();
})

//수정 완료 이벤트
update.addEventListener('click', () => { 
    for (let i = 0; i < members.length; i++) { 
        if (members[i]['id'] == memberId.value) { 
            members[i]['name'] = userName.value;
            members[i]['part'] = parts.value;
            members[i]['position'] = position.value;
            members[i]['join'] = join.value;
            members[i]['email'] = email.value;
        }
    }
    changeText();
    localStorage.setItem('members', JSON.stringify(members));
    location.reload();
});

//검색 이벤트
search.addEventListener('click', () => {
    let findValue = find.value;
    for (let i = 0; i < members.length; i++) {
        if ((members[i]['name'].indexOf(findValue) > -1) 
            || (members[i]['part'].indexOf(findValue) > -1) 
            || (members[i]['position'].indexOf(findValue) > -1) 
            || (members[i]['join'].indexOf(findValue) > -1) 
            || (members[i]['email'].indexOf(findValue) > -1)) {
                findMember.push(members[i]);
            }
    }
    // 테이블 초기화
    tableBody.innerHTML = '';
    for (let i = 0; i < findMember.length; i++) {
        const passDay = calcDay(findMember[i]['join']);
        let findMem = `<tr><td>${i + 1}</td><td>${findMember[i]['name']}</td>
                <td>${findMember[i]['part']}</td><td>${findMember[i]['position']}</td>
                <td>${findMember[i]['join']}</td><td>${passDay}일</td><td>${findMember[i]['email']}</td>
                <td><button class='revise' data-number=${findMember[i]['id']}>수정</button></td>
                <td><button class='delete' data-id=${findMember[i]['id']}>삭제</button></td></tr>`;
                tableBody.innerHTML += findMem;
    }
    delete_f();
    searchMem();
    findMember = []; //검색한 객체 다시 비우기
});
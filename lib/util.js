module.exports = {
    
    //login 정보 출력 함수
    authIsOwner : (req, res)=>{

        //login 하지 않았을 경우 다음과 같이 저장
        var name = 'Guest';
        var login = false;

        //login 되어있을 경우 다음과 같이 저장
        if(req.session.is_logined){
            name = req.session.name;
            login = true;
        }

        //저장된 사용자 nickName과 login 여부 리턴
        return {name, login}
    }
}
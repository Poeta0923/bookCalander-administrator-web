module.exports = {
    
    //login 정보 출력 함수
    authIsOwner : (req, res)=>{

        //login 하지 않았을 경우 다음과 같이 출력
        var name = 'Guest';
        var login = false;

        //login 되어있을 경우 다음과 같이 출력
        if(req.session.is_logined){
            name = req.session.name;
            login = true;
        }
        return {name, login}
    }
}
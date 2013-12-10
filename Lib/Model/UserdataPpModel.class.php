<?php

class UserdataPpModel extends Model {

    protected $tableName = 'userdata_pp';

    public function uploadCount($nick, $ip) {
        $where['nick'] = $nick;
        $result = $this->where($where)->setInc('upCnt');
        if (!$result) {
            $where['ip'] = $ip;
            $result = $this->add($where);
            $result = $this->where($where)->setInc('upCnt');
        }
        return $result;
    }

    public function updateProfit($nick, $profit) {
        $where['nick'] = $nick;
        $result = $this->where($where)->setField('profit', $profit);
        if (!$result) {
            $result = $this->add($where);
            $result = $this->where($where)->setField('profit', $profit);
        }
        return $result;
    }

}

?>
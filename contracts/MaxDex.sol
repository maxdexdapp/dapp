//SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

interface Aggregator {
    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        );
}

/**
 * @dev Interface of the ERC20 standard as defined in the EIP.
 */
interface IERC20 {
    event Transfer(address indexed from, address indexed to, uint256 value);

    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    function totalSupply() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function transfer(address to, uint256 amount) external returns (bool);

    function allowance(
        address owner,
        address spender
    ) external view returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);

    function decimals() external view returns (uint256);
}

contract MaxDex {
    address payable public owner;
    uint256 public maxForsale = 200000000;
    uint256 public totalTokensSold;
    uint256 public totalUSDTRaised;
    uint256 public totalETHRaised;
    uint256 public totalTokenBuyer;
    uint256 public totalTokenClaimed;
    address public tokenAddr = address(0);
    uint256 public currentStep = 0;
    uint256 public timeStage = 0; //0:presale 1:claim
    uint256 public decimalUSDT = 10 ** 6;
    uint256 public decimalToken = 10 ** 18;
    uint256 public appID = 0;
    uint256 public listID = 0;
    uint256 public limitTime = 30 days;
    uint256 public feeSwap = 2; //0.2%

    IERC20 public MXDX = IERC20(0xdAC17F958D2ee523a2206206994597C13D831ec7);
    IERC20 public USDZ = IERC20(0xdAC17F958D2ee523a2206206994597C13D831ec7);
    IERC20 public USDTAddr = IERC20(0xdAC17F958D2ee523a2206206994597C13D831ec7);
    Aggregator public aggregatorInterface =
        Aggregator(0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419);

    struct PairInfo {
        address creater;
        address token0;
        uint256 reserve0;
        address token1;
        uint256 reserve1;
        uint256 iniPrice;
        uint256 price;
        uint8 state;
        //address[] agree;
        //address[] disAgree;

        uint256 start_time;
        //address[] voter;
        // mapping(address => bool) vote;
    }
    /*
    struct Liquidity {
        uint256 amt0;
        uint256 amt1;
    }
*/
    struct uLiquidity {
        address user;
        uint256 amt;
    }

    struct VolumeRecord {
        uint256 startTime;
        uint256 limitVol;
        uint256 cntVol;
    }

    struct bonusAssign {
        address user;
        uint256 amt;
    }

    struct addrReserve {
        mapping(address => uint256) reserve0;
        mapping(address => uint256) reserve1;
    }

    mapping(uint256 => address[]) Voter;
    mapping(uint256 => mapping(address => bool)) Vote;

    mapping(uint256 => uint256) Bonus;
    mapping(uint256 => mapping(address => uint256)) BonusShared;

    mapping(uint256 => mapping(uint8 => mapping(address => uint256))) userLiquidity;
    //mapping(uint256 => mapping(uint8 => mapping(address => uint256))) limitLiquidity;
    mapping(uint256 => mapping(uint8 => uLiquidity[])) orderLiquidity;
    //mapping(uint256 => mapping(uint8 => mapping(address => uint256))) limitLiquidity;
    mapping(uint256 => mapping(uint8 => uLiquidity[])) limitLiquidity;
    mapping(uint256 => mapping(uint8 => uLiquidity[])) extraLiquidity;
    mapping(uint256 => bonusAssign[]) userBonus;

    mapping(uint256 => PairInfo) public applyPair;
    mapping(uint256 => PairInfo) public tradePair;

    mapping(address => uint256) public userBought;
    mapping(address => bool) public hasClaimed;

    mapping(uint256 => VolumeRecord) public recVolume;

    event event_applyPair(
        address indexed creater,
        address indexed token0,
        uint256 indexed amt1,
        address token1,
        uint256 amt2,
        uint256 price,
        uint256 timestamp
    );

    event event_votePair(
        address indexed voter,
        uint256 indexed id,
        bool vote,
        uint256 timestamp
    );

    event event_confirmPair(
        address indexed confirm,
        uint256 indexed id,
        uint8 state,
        uint256 timestamp
    );

    event event_addLiquidity(
        address indexed user,
        uint256 indexed id,
        uint256 amt0,
        uint256 amt1,
        uint256 timestamp
    );

    event event_removeLiquidity(
        address indexed user,
        uint256 indexed id,
        uint256 amt0,
        uint256 amt1,
        uint256 timestamp
    );

    modifier onlyOwner() {
        require(owner == msg.sender, "MaxDexV1:caller is not the owner");
        _;
    }

    constructor() {
        owner = payable(msg.sender);
    }

    function setOwner(address _addr) public onlyOwner {
        owner = payable(_addr);
    }

    function applyForPair(
        address token0,
        uint256 amt0,
        // address token1,
        uint256 amt1,
        uint256 iniPrice
    ) external returns (uint256) {
        require(token0 != address(0), "MaxDexV1:address token0 can't be zero");
        require(amt0 > 0, "MaxDexV1:amount1 should more than zero");
        // require(token1 != address(0), "address token1 can't be zero");
        // require(amt2 > 0, "amount2 should more than zero");
        require(iniPrice > 0, "MaxDexV1:price should more than zero");
        //uint256 usdtAmt;

        //check if exist
        bool bExist;
        for (uint256 i = 0; i < appID; i++) {
            if (
                applyPair[i].token0 == token0 &&
                (applyPair[i].state == 0 || applyPair[i].state == 2)
            ) {
                bExist = true;
                break;
            }
        }

        require(bExist == false, "MaxDexV1:already exist");

        uint256 allow0 = IERC20(token0).allowance(msg.sender, address(this));
        require(amt0 <= allow0, "MaxDexV1:Make sure to add enough allowance");
        (bool success, ) = address(token0).call(
            abi.encodeWithSignature(
                "transferFrom(address,address,uint256)",
                msg.sender,
                this,
                amt0
            )
        );
        require(success, "MaxDexV1:Token payment failed");

        if (amt1 > 0) {
            uint256 allow1 = IERC20(USDZ).allowance(msg.sender, address(this));
            require(
                amt1 <= allow1,
                "MaxDexV1:Make sure to add enough allowance"
            );
            (bool success2, ) = address(USDZ).call(
                abi.encodeWithSignature(
                    "transferFrom(address,address,uint256)",
                    msg.sender,
                    this,
                    amt1
                )
            );
            require(success2, "MaxDexV1:Token payment failed");
        }

        applyPair[appID++] = PairInfo(
            msg.sender,
            token0,
            amt0,
            address(USDZ),
            amt1,
            iniPrice,
            0,
            0,
            block.timestamp
        );

        emit event_applyPair(
            msg.sender,
            token0,
            amt0,
            address(USDZ),
            amt1,
            iniPrice,
            block.timestamp
        );

        return appID;
    }

    //vote for trade pair
    function voteForPair(uint256 id, bool vote) external returns (bool) {
        require(id < appID, "MaxDexV1:Invalid id for trade pair apply");
        //require(id < appID, "Invalid id for trade pair apply");

        PairInfo memory tp = applyPair[id];
        require(tp.state == 0, "MaxDexV1:trade pair not for apply");
        require(
            block.timestamp - tp.start_time <= 72 hours,
            "MaxDexV1:trade pair not for apply"
        );

        bool bExist = false;
        uint256 i;
        for (i = 0; i < Voter[id].length; i++) {
            if (Voter[id][i] == msg.sender) {
                bExist = true;
                //delete tp.agree[i];
                break;
            }
        }

        if (!bExist) Voter[id].push(msg.sender);

        Vote[id][msg.sender] = vote;

        /*
uint256 i;



bool bExist = false;
if(vote)
{

     tp.vote[msg.sender] = vote;
    
      for(i=0; i<tp.agree.length; i++)
    {
        if(tp.agree[i] == msg.sender)
         {bExist = true;
         //delete tp.agree[i];
         break;

         }
    }

    require(bExist == false,"voter exist!");
    tp.agree.push(msg.sender);


     for(i=0; i<tp.disAgree.length; i++)
    {
        if(tp.disAgree[i] == msg.sender)
         {//bExist = true;
         delete tp.disAgree[i];
         break;

         }
    }

    
}
 else
 {
   

   for(i=0; i<tp.disAgree.length; i++)
    {
        if(tp.disAgree[i] == msg.sender)
         {bExist = true;
         //delete tp.agree[i];
         break;

         }
    }

    require(bExist == false,"voter exist!");
    tp.disAgree.push(msg.sender);


     for(i=0; i<tp.agree.length; i++)
    {
        if(tp.agree[i] == msg.sender)
         {//bExist = true;
         delete tp.agree[i];
         break;

         }
    }

 }

*/

        emit event_votePair(msg.sender, id, vote, block.timestamp);

        return vote;
    }

    //confirm the result of vote for trade pair
    function confirmForPair(uint256 id) external returns (uint8) {
        require(id < appID, "MaxDexV1:Invalid id for trade pair apply");
        //require(id < appID, "Invalid id for trade pair apply");

        PairInfo memory tp = applyPair[id];
        require(tp.creater == msg.sender, "MaxDexV1:not trade pair's creater");
        require(tp.state == 0, "MaxDexV1:trade pair not for apply");
        require(
            block.timestamp - tp.start_time > 72 hours,
            "MaxDexV1:trade pair not for confirm"
        );

        uint256 i;
        uint256 cnt_agree;
        uint256 cnt_disAgree;

        for (i = 0; i < Voter[id].length; i++) {
            if (Vote[id][Voter[id][i]])
                cnt_agree += IERC20(MXDX).balanceOf(Voter[id][i]);
            else cnt_disAgree += IERC20(MXDX).balanceOf(Voter[id][i]);
        }

        if (cnt_agree <= cnt_disAgree) tp.state = 1;
        else {
            tp.state = 2;

            //PairInfo memory tp = applyPair[id]; //PairInfo(msg.sender,token0,amt1,token1,amt2,price,0,block.timestamp};
            //tp.start_time = block.timestamp;
            tradePair[listID] = tp;
            tradePair[listID].start_time = block.timestamp;
            listID++;
        }

        emit event_confirmPair(msg.sender, id, tp.state, block.timestamp);

        return tp.state;
    }

    function changePairPrice(uint256 id, uint256 iniPrice) public {
        require(id < listID, "MaxDexV1:Invalid id for trade pair");
        //require(id < appID, "Invalid id for trade pair apply");

        //PairInfo memory tp = tradePair[id];
        require(
            tradePair[id].creater == msg.sender,
            "MaxDexV1:you are not trade pair's creater"
        );
        require(
            tradePair[id].price == 0,
            "MaxDexV1:price can't change anymore"
        );

        tradePair[id].iniPrice = iniPrice;
    }

    function addLiquidity(
        uint256 id,
        // address token0,
        uint256 amt0,
        // address token1,
        uint256 amt1
    ) external {
        require(id < listID, "MaxDexV1:id not exist");
        /*
        require(
            (token0 != address(0) && token0 == tradePair[id].token0 && amt0 > 0) || amt1 > 0,
            "token0 or token1 can't be zero"
        );
*/

        if (amt0 > 0) {
            address token0 = tradePair[id].token0;
            uint256 allow0 = IERC20(token0).allowance(
                msg.sender,
                address(this)
            );
            require(
                amt0 <= allow0,
                "MaxDexV1:Make sure to add enough allowance"
            );
            (bool success, ) = address(token0).call(
                abi.encodeWithSignature(
                    "transferFrom(address,address,uint256)",
                    msg.sender,
                    this,
                    amt0
                )
            );
            require(success, "MaxDexV1:Token payment failed");
            tradePair[id].reserve0 += amt0;

            //uint256 iExist = 0;
            //orderLiquidity[id][0][msg.sender] += amt0;

            orderLiquidity[id][0].push(uLiquidity(msg.sender, amt0));
            userLiquidity[id][0][msg.sender] += amt0;
            /*
            for(uint256 i=0; i<orderLiquidity[id][0].length;i++)
             {
                if(orderLiquidity[id][0][i].user == msg.sender)
                     { iExist = i+1;
                      break;}


             }

             if(iExist>0)
             {


             }
             */
        }

        if (amt1 > 0) {
            address token1 = tradePair[id].token1;
            uint256 allow1 = IERC20(token1).allowance(
                msg.sender,
                address(this)
            );
            require(
                amt1 <= allow1,
                "MaxDexV1:Make sure to add enough allowance"
            );
            (bool success, ) = address(token1).call(
                abi.encodeWithSignature(
                    "transferFrom(address,address,uint256)",
                    msg.sender,
                    this,
                    amt1
                )
            );
            require(success, "MaxDexV1:Token payment failed");
            tradePair[id].reserve1 += amt1;

            orderLiquidity[id][1].push(uLiquidity(msg.sender, amt1));
            userLiquidity[id][1][msg.sender] += amt1;
        }

        emit event_addLiquidity(msg.sender, id, amt0, amt1, block.timestamp);
    }

    function removeLiquidity(
        uint256 id,
        // address token0,
        uint256 amt0,
        // address token1,
        uint256 amt1
    ) external {
        require(id < listID, "MaxDexV1:id not exist");
        /*
        require(
            (token0 != address(0) && amt1 > 0) || amt2 > 0,
            "MaxDexV1:token0 or token1 can't be zero"
        );
*/
        if (amt0 > 0) {
            require(
                userLiquidity[id][0][msg.sender] >= amt0,
                "MaxDexV1:liquidity is less than removing"
            );
            //pair have enough token0 to transfer
            if (tradePair[id].reserve0 >= amt0) {
                tradePair[id].reserve0 -= amt0;
                userLiquidity[id][0][msg.sender] -= amt0;

                IERC20(tradePair[id].token0).transfer(msg.sender, amt0);
            } else {
                //pair have not enough token0 to transfer, then transfer equal extra token1 too
                uint256 extra = (amt0 - tradePair[id].reserve0) *
                    tradePair[id].price;
                require(
                    tradePair[id].reserve1 >= extra,
                    "MaxDexV1:liquidity is less than extra"
                );
                IERC20(tradePair[id].token0).transfer(
                    msg.sender,
                    tradePair[id].reserve0
                );
                IERC20(tradePair[id].token1).transfer(msg.sender, extra);

                tradePair[id].reserve0 = 0;
                tradePair[id].reserve1 -= extra;
                userLiquidity[id][0][msg.sender] -= amt0;
                //userLiquidity[id][1][msg.sender] -= extra;
            }
        }
        if (amt1 > 0) {
            require(
                userLiquidity[id][1][msg.sender] >= amt1,
                "MaxDexV1:liquidity is less than removing"
            );
            //pair have enough token0 to transfer
            if (tradePair[id].reserve1 >= amt1) {
                tradePair[id].reserve1 -= amt1;
                userLiquidity[id][1][msg.sender] -= amt1;

                IERC20(tradePair[id].token1).transfer(msg.sender, amt1);
            } else {
                //pair have not enough token0 to transfer, then transfer equal extra token1 too
                uint256 extra = (amt1 - tradePair[id].reserve1) /
                    tradePair[id].price;
                require(
                    tradePair[id].reserve0 >= extra,
                    "MaxDexV1:liquidity is less than extra"
                );
                IERC20(tradePair[id].token1).transfer(
                    msg.sender,
                    tradePair[id].reserve1
                );
                IERC20(tradePair[id].token0).transfer(msg.sender, extra);

                tradePair[id].reserve0 -= extra;
                tradePair[id].reserve1 = 0;
                userLiquidity[id][1][msg.sender] -= amt1;
            }
        }

        emit event_removeLiquidity(msg.sender, id, amt0, amt1, block.timestamp);
    }

    function estimateBuyPay(
        uint256 id,
        uint256 amt
    ) public returns (uint256, uint256) {
        require(id < listID, "MaxDexV1:trade pair's id not exist");
        require(amt > 0, "MaxDexV1:amount should more than zero");

        uint256 price;

        if (tradePair[id].price == 0) price = tradePair[id].iniPrice;
        else price = tradePair[id].price;

        //𝛥𝑋 = 𝛥𝑌 ⋅ (1 − 𝐹) ∕ (𝑃1 ⋅ (1 + (𝛥𝑌⁄𝑃1)⁄(𝑋 ⋅ 𝐾)))
        uint256 nprice = price + ((amt * price) / tradePair[id].reserve0) / 10;
        uint256 pay = (amt * nprice * (1000 + feeSwap)) / 1000 / 10 ** 18;

        return (nprice, pay);
    }

    function estimateSellPaid(
        uint256 id,
        uint256 amt
    ) public returns (uint256, uint256) {
        require(id < listID, "MaxDexV1:trade pair's id not exist");
        require(amt > 0, "MaxDexV1:amount should more than zero");

        uint256 price;

        if (tradePair[id].price == 0) price = tradePair[id].iniPrice;
        else price = tradePair[id].price;

        //𝛥𝑋 = 𝛥𝑌 ⋅ (1 − 𝐹) ∕ (𝑃1 ⋅ (1 + (𝛥𝑌⁄𝑃1)⁄(𝑋 ⋅ 𝐾)))
        uint256 nprice = price - ((amt * price) / tradePair[id].reserve0) / 10;
        uint256 paid = (amt * nprice * (1000 - feeSwap)) / 1000 / 10 ** 18;

        return (nprice, paid);
    }

    function buy(uint256 id, uint256 amt) public {
        uint256 nprice;
        uint256 pay;
        (nprice, pay) = estimateBuyPay(id, amt);

        /*
        uint256 ourAllowance = IERC20(USDZ).allowance(
            msg.sender,
            address(this)
        );
        require(
            amt <= ourAllowance,
            "MaxDexV1:Make sure to add enough allowance"
        );
        */

        (bool success, ) = address(USDZ).call(
            abi.encodeWithSignature(
                "transferFrom(address,address,uint256)",
                msg.sender,
                address(this),
                pay
            )
        );
        require(success, "MaxDexV1:Token payment failed");

        uint256 dec = IERC20(tradePair[id].token0).decimals();

        if (dec != 18) amt = (amt * 10 ** dec) / 10 ** 18;

        IERC20(tradePair[id].token0).transfer(msg.sender, amt);
        tradePair[id].reserve0 -= amt;
        tradePair[id].reserve1 += (pay * (1000 - feeSwap)) / 1000;
        tradePair[id].price = nprice;

        //calcLiquidityLimit(id, amt);
    }

    function sell(uint256 id, uint256 amt) public {
        uint256 nprice;
        uint256 paid;
        (nprice, paid) = estimateSellPaid(id, amt);

        /*
        uint256 ourAllowance = IERC20(token0).allowance(
            msg.sender,
            address(this)
        );
        require(
            amt <= ourAllowance,
            "MaxDexV1:Make sure to add enough allowance"
        );
        */
        (bool success, ) = address(tradePair[id].token0).call(
            abi.encodeWithSignature(
                "transferFrom(address,address,uint256)",
                msg.sender,
                address(this),
                amt
            )
        );
        require(success, "MaxDexV1:Token payment failed");

        uint256 dec = IERC20(tradePair[id].token0).decimals();

        if (dec != 18) amt = (amt * 10 ** dec) / 10 ** 18;

        IERC20(tradePair[id].token1).transfer(msg.sender, paid);
        tradePair[id].reserve0 += amt;
        tradePair[id].reserve1 -= (paid * (1000 + feeSwap)) / 1000;
        tradePair[id].price = nprice;

        //calcLiquidityLimit(id, amt);
    }

    function calcLiquidityLimit(uint256 id, uint256 amt) public {
        uint256 t = block.timestamp - 30 days;

        //calculate trade volume of the span time
        if (recVolume[id].startTime == 0) {
            recVolume[id].startTime = block.timestamp;
            recVolume[id].cntVol = amt;
        } else if (block.timestamp - recVolume[id].startTime < limitTime) {
            recVolume[id].cntVol += amt;
        } else if (block.timestamp - recVolume[id].startTime >= limitTime) {
            recVolume[id].startTime = block.timestamp;
            recVolume[id].limitVol = recVolume[id].cntVol;
            recVolume[id].cntVol = amt;
        }

        if (tradePair[id].reserve0 < (recVolume[id].limitVol * 80) / 100) {
            //extraLiquidity
        }

        //if trade volume of the span time less than trade pair token's liquidity
        //if trade pair token's liquidity less than trade volume of the span time
        if (
            tradePair[id].reserve0 > (recVolume[id].limitVol * 120) / 100 ||
            tradePair[id].reserve0 < (recVolume[id].limitVol * 80) / 100
        ) {
            delete limitLiquidity[id][0];
            uint256 reserve0 = 0;
            uint256 cnt = 0;
            uint256 limit = recVolume[id].limitVol;

            for (uint256 i = 0; i < orderLiquidity[id][0].length; i++) {
                cnt += orderLiquidity[id][0][i].amt;
                if (cnt >= limit) {
                    uint256 m;
                    if (i == 0) m = limit;
                    else if (i > 0)
                        m = limit - (cnt - orderLiquidity[id][0][i].amt);

                    limitLiquidity[id][0].push(
                        uLiquidity(orderLiquidity[id][0][i].user, m)
                    );
                    reserve0 += m;
                    break;
                } else {
                    limitLiquidity[id][0].push(
                        uLiquidity(
                            orderLiquidity[id][0][i].user,
                            orderLiquidity[id][0][i].amt
                        )
                    );
                    reserve0 += orderLiquidity[id][0][i].amt;
                }
            }

            tradePair[id].reserve0 = reserve0;
            tradePair[id].reserve1 = (reserve0 * tradePair[id].price) / 1e18;
            limit = tradePair[id].reserve1;

            delete limitLiquidity[id][1];
            //uint256 reserve1 = 0;
            cnt = 0;

            for (uint256 i = 0; i < orderLiquidity[id][1].length; i++) {
                cnt += orderLiquidity[id][1][i].amt;
                if (cnt >= limit) {
                    uint256 m;
                    if (i == 0) m = limit;
                    else if (i > 0)
                        m = limit - (cnt - orderLiquidity[id][1][i].amt);

                    limitLiquidity[id][1].push(
                        uLiquidity(orderLiquidity[id][1][i].user, m)
                    );
                    //reserve1 += m;
                    break;
                } else {
                    limitLiquidity[id][1].push(
                        uLiquidity(
                            orderLiquidity[id][1][i].user,
                            orderLiquidity[id][1][i].amt
                        )
                    );
                    //reserve1 += orderLiquidity[id][1][i].amt;
                }
            }
        }
    }
}

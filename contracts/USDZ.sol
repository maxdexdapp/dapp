/**
 *Submitted for verification at Etherscan.io on 2022-10-19
 */

// File: @openzeppelin/contracts/token/ERC20/IERC20.sol

// OpenZeppelin Contracts (last updated v4.6.0) (token/ERC20/IERC20.sol)

pragma solidity ^0.8.0;

/**
 * @dev Interface of the ERC20 standard as defined in the EIP.
 */
interface IERC20 {
    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `to`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address to, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender)
        external
        view
        returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves `amount` tokens from `from` to `to` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
}

// File: @openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol

// OpenZeppelin Contracts v4.4.1 (token/ERC20/extensions/IERC20Metadata.sol)

pragma solidity ^0.8.0;

/**
 * @dev Interface for the optional metadata functions from the ERC20 standard.
 *
 * _Available since v4.1._
 */
interface IERC20Metadata is IERC20 {
    /**
     * @dev Returns the name of the token.
     */
    function name() external view returns (string memory);

    /**
     * @dev Returns the symbol of the token.
     */
    function symbol() external view returns (string memory);

    /**
     * @dev Returns the decimals places of the token.
     */
    function decimals() external view returns (uint8);
}

// File: @openzeppelin/contracts/utils/Context.sol

// OpenZeppelin Contracts v4.4.1 (utils/Context.sol)

pragma solidity ^0.8.0;

/**
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}

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

    function decimals() external view returns (uint8 answer);
}

contract USDZ is Context, IERC20Metadata {
    address payable public owner;
    mapping(address => uint256) private _balances;

    mapping(address => mapping(address => uint256)) private _allowances;

    uint256 private _totalSupply;

    string private _name = "USD Stable Coin";
    string private _symbol = "USDZ";
    uint8 private constant _decimals = 6;
    // uint256 public constant hardCap = 1_000_000_000 * (10**_decimals); //1 billion

    /*
    //ethereum
    IERC20 public USDT = IERC20(0xdAC17F958D2ee523a2206206994597C13D831ec7);
    IERC20 public USDC = IERC20(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48);
    IERC20 public DAI = IERC20(0x6B175474E89094C44Da98b954EedeAC495271d0F);
    IERC20 public BUSD = IERC20();

    Aggregator public aggreUSDT =
        Aggregator(0x3E7d1eAB13ad0104d2750B8863b489D65364e32D);
    Aggregator public aggreUSDC =
        Aggregator(0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6);
    Aggregator public aggreDAI =
        Aggregator(0xAed0c38402a5d19df6E4c03F4E2DceD6e29c1ee9);
        Aggregator public aggreBUSD =
        Aggregator(0x833D8Eb16D306ed1FbB5D7A2E019e106B960965A);
*/

    //goerli

    IERC20 public USDT = IERC20(0x8e90438D5529Ff8f3c4824f447c82c730F06D0aF);
    IERC20 public USDC = IERC20(0x07865c6E87B9F70255377e024ace6630C1Eaa37F);
    IERC20 public DAI = IERC20(0x5C221E77624690fff6dd741493D735a17716c26B);
    IERC20 public BUSD = IERC20(0x7176b772996F42fA2c8B3Db786BbB055D2c064c9);

    Aggregator public aggreUSDT =
        Aggregator(0xAb5c49580294Aff77670F839ea425f5b78ab3Ae7);
    Aggregator public aggreUSDC =
        Aggregator(0xAb5c49580294Aff77670F839ea425f5b78ab3Ae7);
    Aggregator public aggreDAI =
        Aggregator(0x0d79df66BE487753B02D015Fb622DED7f0E9798d);
    Aggregator public aggreBUSD =
        Aggregator(0x0d79df66BE487753B02D015Fb622DED7f0E9798d);

    event TokensExchange(
        address indexed user,
        address indexed token,
        uint256 indexed amount,
        uint256 usdzAmt,
        uint256 timestamp
    );

    event USDZExchange(
        address indexed user,
        address indexed token,
        uint256 indexed amount,
        uint256 usdzAmt,
        uint256 timestamp
    );

    constructor() {
        //_mint(msg.sender, hardCap);
        owner = payable(msg.sender);
    }

    function name() public view virtual override returns (string memory) {
        return _name;
    }

    function symbol() public view virtual override returns (string memory) {
        return _symbol;
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    function totalSupply() public view virtual override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account)
        public
        view
        virtual
        override
        returns (uint256)
    {
        return _balances[account];
    }

    function transfer(address recipient, uint256 amount)
        public
        virtual
        override
        returns (bool)
    {
        _transfer(_msgSender(), recipient, amount);
        return true;
    }

    function allowance(address from, address to)
        public
        view
        virtual
        override
        returns (uint256)
    {
        return _allowances[from][to];
    }

    function approve(address to, uint256 amount)
        public
        virtual
        override
        returns (bool)
    {
        _approve(_msgSender(), to, amount);
        return true;
    }

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public virtual override returns (bool) {
        _transfer(sender, recipient, amount);

        uint256 currentAllowance = _allowances[sender][_msgSender()];
        require(
            currentAllowance >= amount,
            "ERC20: transfer amount exceeds allowance"
        );
        unchecked {
            _approve(sender, _msgSender(), currentAllowance - amount);
        }

        return true;
    }

    function increaseAllowance(address to, uint256 addedValue)
        public
        virtual
        returns (bool)
    {
        _approve(_msgSender(), to, _allowances[_msgSender()][to] + addedValue);
        return true;
    }

    function decreaseAllowance(address to, uint256 subtractedValue)
        public
        virtual
        returns (bool)
    {
        uint256 currentAllowance = _allowances[_msgSender()][to];
        require(
            currentAllowance >= subtractedValue,
            "ERC20: decreased allowance below zero"
        );
        unchecked {
            _approve(_msgSender(), to, currentAllowance - subtractedValue);
        }

        return true;
    }

    function _transfer(
        address sender,
        address recipient,
        uint256 amount
    ) internal virtual {
        require(sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");

        uint256 senderBalance = _balances[sender];
        require(
            senderBalance >= amount,
            "ERC20: transfer amount exceeds balance"
        );
        unchecked {
            _balances[sender] = senderBalance - amount;
        }
        _balances[recipient] += amount;

        emit Transfer(sender, recipient, amount);
    }

    function _mint(address account, uint256 amount) internal virtual {
        require(account != address(0), "ERC20: mint to the zero address");

        _totalSupply += amount;
        _balances[account] += amount;
        emit Transfer(address(0), account, amount);
    }

    function _burn(address account, uint256 amount) internal virtual {
        require(account != address(0), "ERC20: burn from the zero address");

        uint256 accountBalance = _balances[account];
        require(accountBalance >= amount, "ERC20: burn amount exceeds balance");
        unchecked {
            _balances[account] = accountBalance - amount;
        }
        _totalSupply -= amount;

        emit Transfer(account, address(0), amount);
    }

    function burn(uint256 amount) public {
        _burn(_msgSender(), amount);
    }

    function _approve(
        address from,
        address to,
        uint256 amount
    ) internal virtual {
        require(from != address(0), "ERC20: approve from the zero address");
        require(to != address(0), "ERC20: approve to the zero address");

        _allowances[from][to] = amount;
        emit Approval(from, to, amount);
    }

    function getLatestPriceUSDT() public view returns (uint256) {
        //uint8 decimalPlaces = aggreUSDT.decimals();
        (, int256 price, , , ) = aggreUSDT.latestRoundData();
        price = (price * (10**12));
        return uint256(price);
    }

    function getLatestPriceUSDC() public view returns (uint256) {
        //uint8 decimalPlaces = aggreUSDC.decimals();
        (, int256 price, , , ) = aggreUSDC.latestRoundData();
        price = (price * (10**12));
        return uint256(price);
    }

    function getLatestPriceDAI() public view returns (uint256) {
        //uint8 decimalPlaces = aggreDAI.decimals();
        (, int256 price, , , ) = aggreDAI.latestRoundData();
        price = (price * (10**12));
        return uint256(price);
    }

    function getLatestPriceBUSD() public view returns (uint256) {
        //uint8 decimalPlaces = aggreBUSD.decimals();
        (, int256 price, , , ) = aggreBUSD.latestRoundData();
        price = (price * (10**12));
        return uint256(price);
    }

    function exchangeToken(uint256 amount, IERC20 token)
        internal
        returns (bool)
    {
        require(amount > 0, "amount is zero");

        uint256 ourAllowance = IERC20(token).allowance(
            msg.sender,
            address(this)
        );
        require(amount <= ourAllowance, "Make sure to add enough allowance");
        (bool success, ) = address(token).call(
            abi.encodeWithSignature(
                "transferFrom(address,address,uint256)",
                msg.sender,
                address(this),
                amount
            )
        );
        require(success, "Token payment failed");

        uint256 price;

        if (IERC20(token) == USDT) price = getLatestPriceUSDT();
        else if (IERC20(token) == USDC) price = getLatestPriceUSDC();
        else if (IERC20(token) == DAI) price = getLatestPriceDAI();
        else if (IERC20(token) == BUSD) price = getLatestPriceBUSD();

        uint256 usdzAmt = amount * price;
        _mint(msg.sender, usdzAmt);

        emit TokensExchange(
            msg.sender,
            address(token),
            amount,
            usdzAmt,
            block.timestamp
        );
        return true;
    }

    function exchangeUSDT(uint256 amount) external returns (bool) {
        return exchangeToken(amount, USDT);
    }

    function exchangeUSDC(uint256 amount) external returns (bool) {
        return exchangeToken(amount, USDC);
    }

    function exchangeDAI(uint256 amount) external returns (bool) {
        return exchangeToken(amount, DAI);
    }

    function exchangeBUSD(uint256 amount) external returns (bool) {
        return exchangeToken(amount, BUSD);
    }

    function exchangeUSDZToToken(uint256 amount, IERC20 token)
        internal
        returns (bool)
    {
        require(amount > 0, "amount is zero");

        burn(amount);

        uint256 price;

        if (token == USDT) price = getLatestPriceUSDT();
        else if (token == USDC) price = getLatestPriceUSDC();
        else if (token == DAI) price = getLatestPriceDAI();
        else if (token == BUSD) price = getLatestPriceBUSD();

        uint256 tokenAmt = (amount * 10**36) / price;
        require(
            IERC20(token).balanceOf(address(this)) >= tokenAmt,
            "token is not enough!"
        );
        IERC20(token).transfer(msg.sender, tokenAmt);

        emit USDZExchange(
            msg.sender,
            address(token),
            amount,
            tokenAmt,
            block.timestamp
        );
        return true;
    }

    function exchangeUSDZ(uint256 amount, uint256 t) external returns (bool) {
        require(t < 4, "type not correct");

        IERC20 addr;

        if (t == 0) addr = USDT;
        else if (t == 1) addr = USDC;
        else if (t == 2) addr = DAI;
        else if (t == 3) addr = BUSD;

        return exchangeUSDZToToken(amount, addr);
    }
}

const Gelato = artifacts.require('Gelato');
const EtherToken = artifacts.require('EtherToken')

// const EtherToken = contract(require('@gnosis.pm/util-contracts/build/contracts/EtherToken'))

module.exports = function() {
   
    async function test() {

        const gelato = await Gelato.at(Gelato.address)
        const etherToken = await EtherToken.at(EtherToken.address)
        // Selling a total of 2 WETH
        const sellAmount = web3.utils.toWei("20")
        const subOrderAmount = web3.utils.toWei("10")
        const seller = '0x627306090abab3a6e1400e9345bc60c78a8bef57'
        const nonce = 3
        const executionReward = 1
        const freezeTime = 86400 // 24h

        console.log("Let's start that shit")
        const block = await web3.eth.getBlockNumber()
        const blockDetails = await web3.eth.getBlock(block)
        const timestamp = blockDetails.timestamp
        console.log("Current Timestamp:", timestamp)

        console.log("Create 1st Sell Order...")
    
        const sellOrder = await gelato.createSellOrder(EtherToken.address, '0x8ACEe021a27779d8E98B9650722676B850b25E11', sellAmount, subOrderAmount, 2, 1560682564, freezeTime, executionReward, nonce, {from: seller})
        
        console.log("1st Sell Order created by:", seller)

        const sellOrderHash = sellOrder.logs[0].args.sellOrderHash
        console.log("sellOrderHash: ", sellOrderHash)
        let struct = await gelato.sellOrders(sellOrderHash)
        
        let hammerTime = struct.hammerTime.toString()
        console.log("HammerTime: ", hammerTime)

        console.log("Set allowance for 20 WETH for Gelato contract")
        let approval = await etherToken.approve(Gelato.address, sellAmount, {from: '0x627306090abab3a6e1400e9345bc60c78a8bef57'})
        console.log("Approved: ", approval.logs[0].args.value.toString())

        console.log("Check approval...")
        const allowance = await etherToken.allowance('0x627306090abab3a6e1400e9345bc60c78a8bef57', Gelato.address)
        console.log("Allowance: ", allowance.toString())
        console.log("SubOrder: ", struct.subOrderSize.toString())

    }
    test();
}
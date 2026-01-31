use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, Transfer, TokenAccount};

declare_id!("NexuS11111111111111111111111111111111111111");

#[program]
pub mod nexus {
    use super::*;

    pub fn initialize_market(
        ctx: Context<InitializeMarket>,
        question: String,
        amount_yes: u64,
        amount_no: u64,
        end_timestamp: i64,
    ) -> Result<()> {
        let market = &mut ctx.accounts.market;
        market.authority = ctx.accounts.authority.key();
        market.question = question;
        market.liquidity_yes = amount_yes;
        market.liquidity_no = amount_no;
        market.end_timestamp = end_timestamp;
        market.resolved = false;
        market.volume = 0;
        
        // In a real scenario, we would transfer tokens to the vault here
        Ok(())
    }

    pub fn place_trade(ctx: Context<PlaceTrade>, side: Side, amount: u64) -> Result<()> {
        let market = &mut ctx.accounts.market;
        
        // 1. Calculate Price / AMM Logic (Constant Product simplified)
        // Price = Pool / Total
        // This is a naive implementation for the hackathon
        
        match side {
            Side::Yes => {
                market.liquidity_yes += amount;
                // Mint YES shares to user (Mock)
            },
            Side::No => {
                market.liquidity_no += amount;
                // Mint NO shares to user (Mock)
            }
        }
        
        market.volume += amount;

        // 2. Transfer payment from user to vault
        /*
        let cpi_accounts = Transfer {
            from: ctx.accounts.user_token_account.to_account_info(),
            to: ctx.accounts.market_vault.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        token::transfer(
            CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts),
            amount,
        )?;
        */

        emit!(TradeEvent {
            market_id: market.key(),
            user: ctx.accounts.user.key(),
            side,
            amount,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    pub fn resolve_market(ctx: Context<ResolveMarket>, winner: Side) -> Result<()> {
        let market = &mut ctx.accounts.market;
        require!(market.authority == ctx.accounts.authority.key(), CustomError::Unauthorized);
        require!(!market.resolved, CustomError::MarketAlreadyResolved);

        market.resolved = true;
        market.winning_outcome = Some(winner);
        
        emit!(MarketResolvedEvent {
            market_id: market.key(),
            winner,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeMarket<'info> {
    #[account(init, payer = authority, space = 8 + 32 + 200 + 8 + 8 + 8 + 1 + 8)]
    pub market: Account<'info, MarketState>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PlaceTrade<'info> {
    #[account(mut)]
    pub market: Account<'info, MarketState>,
    #[account(mut)]
    pub user: Signer<'info>,
    // Token accounts would be here
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ResolveMarket<'info> {
    #[account(mut)]
    pub market: Account<'info, MarketState>,
    pub authority: Signer<'info>,
}

#[account]
pub struct MarketState {
    pub authority: Pubkey,
    pub question: String,
    pub liquidity_yes: u64,
    pub liquidity_no: u64,
    pub volume: u64,
    pub end_timestamp: i64,
    pub resolved: bool,
    pub winning_outcome: Option<Side>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum Side {
    Yes,
    No,
}

#[event]
pub struct TradeEvent {
    pub market_id: Pubkey,
    pub user: Pubkey,
    pub side: Side,
    pub amount: u64,
    pub timestamp: i64,
}

#[event]
pub struct MarketResolvedEvent {
    pub market_id: Pubkey,
    pub winner: Side,
    pub timestamp: i64,
}

#[error_code]
pub enum CustomError {
    #[msg("You are not authorized to perform this action.")]
    Unauthorized,
    #[msg("Market is already resolved.")]
    MarketAlreadyResolved,
}

# Crafting combinator

## Development

1. `cd` into your factorio mods folder
2. `git clone https://github.com/tamj0rd2/crafting-combinator-tamj0rd2-repo.git`
3. Run `./build.sh` to build the mod
4. Run `./test.sh` to run the automated tests

## How I want this to work

A crafting combinator is a combinator with an input and an output
- input - signals for items to potentially be crafted
- output - the item the combinator has chosen to be crafted

To determine what the item to craft is, the crafting combinator will need to:
- make sure the assembling machine is actually capable of building the item
- choose the item that's most in demand. There may need to be sticky behaviour to prevent the combinator from constantly switching between two items that have similar demand
- it should only craft things that have been researched

## Troubleshooting weird test failures

Create a test function that does nothing except setup the testing area. If it fails, something odd
is probably happening related to cleanup between tests.

Exmaple:

```typescript
test("something", () => {
  setupTestArea()
})
```

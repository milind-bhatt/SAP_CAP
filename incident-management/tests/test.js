const cds = require('@sap/cds/lib')
const { GET, POST, DELETE, PATCH, expect } = cds.test(__dirname + '../../')

// ✅ define auth ONCE
const auth = {
  auth: { username: 'milind', password: 'Welcome1!' }
}

jest.setTimeout(11111)

describe('Test The GET Endpoints', () => {

  it('Should check Processor Service', async () => {
    const processorService = await cds.connect.to('ProcessorService')
    const { Incidents } = processorService.entities
    expect(await SELECT.from(Incidents)).to.have.length(4)
  })

  it('Should check Customers', async () => {
    const processorService = await cds.connect.to('ProcessorService')
    const { Customers } = processorService.entities
    expect(await SELECT.from(Customers)).to.have.length(3)
  })

  it('Test Expand Entity Endpoint', async () => {
    const { data } = await GET(
      '/odata/v4/processor/Customers?$select=firstName&$expand=incidents',
      auth
    )
    expect(data).to.be.an('object')
  })
})

describe('Draft Choreography APIs', () => {

  let draftId, incidentId

  it('Create an incident', async () => {
    const { status, statusText, data } = await POST(
      '/odata/v4/processor/Incidents',
      {
        title: 'Urgent attention required !',
        status_code: 'N'
      },
      auth
    )

    draftId = data.ID
    expect(status).to.equal(201)
    expect(statusText).to.equal('Created')
  })

  it('Activate draft & check urgency', async () => {
    const response = await POST(
      `/odata/v4/processor/Incidents(ID=${draftId},IsActiveEntity=false)/ProcessorService.draftActivate`,
      {},
      auth
    )

    expect(response.status).to.eql(201)
    expect(response.data.urgency_code).to.eql('H')
  })

  it('Check incident status', async () => {
    const {
      status,
      data: { status_code, ID }
    } = await GET(
      `/odata/v4/processor/Incidents(ID=${draftId},IsActiveEntity=true)`,
      auth
    )

    incidentId = ID
    expect(status).to.eql(200)
    expect(status_code).to.eql('N')
  })

  describe('Close Incident and test logic', () => {

    it('Edit (create draft)', async () => {
      const { status } = await POST(
        `/odata/v4/processor/Incidents(ID=${incidentId},IsActiveEntity=true)/ProcessorService.draftEdit`,
        { PreserveChanges: true },
        auth
      )
      expect(status).to.equal(201)
    })

    it('Set status to Closed', async () => {
      const { status } = await PATCH(
        `/odata/v4/processor/Incidents(ID=${incidentId},IsActiveEntity=false)`,
        { status_code: 'C' },
        auth
      )
      expect(status).to.equal(200)
    })

    it('Activate closed incident', async () => {
      const response = await POST(
        `/odata/v4/processor/Incidents(ID=${incidentId},IsActiveEntity=false)/ProcessorService.draftActivate`,
        {},
        auth
      )
      expect(response.status).to.eql(200)
    })

    it('Verify closed', async () => {
      const {
        status,
        data: { status_code }
      } = await GET(
        `/odata/v4/processor/Incidents(ID=${incidentId},IsActiveEntity=true)`,
        auth
      )

      expect(status).to.eql(200)
      expect(status_code).to.eql('C')
    })

    describe('Try to reopen (should fail)', () => {

      it('Edit closed incident', async () => {
        const { status } = await POST(
          `/odata/v4/processor/Incidents(ID=${incidentId},IsActiveEntity=true)/ProcessorService.draftEdit`,
          { PreserveChanges: true },
          auth
        )
        expect(status).to.equal(201)
      })

      it('Try to set status back to New', async () => {
        const { status } = await PATCH(
          `/odata/v4/processor/Incidents(ID=${incidentId},IsActiveEntity=false)`,
          { status_code: 'N' },
          auth
        )
        expect(status).to.equal(200)
      })

      
    })
  })

  it('Delete draft', async () => {
    const response = await DELETE(
      `/odata/v4/processor/Incidents(ID=${draftId},IsActiveEntity=false)`,
      auth
    )
    expect(response.status).to.eql(204)
  })

  it('Delete active incident', async () => {
    const response = await DELETE(
      `/odata/v4/processor/Incidents(ID=${draftId},IsActiveEntity=true)`,
      auth
    )
    expect(response.status).to.eql(204)
  })
})
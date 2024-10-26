import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository.js'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms.js'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'JavaScript Gym',
      latitude: -23.7372146,
      longitude: -46.5768568,
      description: null,
      phone: null,
    })

    await gymsRepository.create({
      title: 'TypeScript Gym',
      latitude: -22.926575097531675,
      longitude: -47.08763224905233,
      description: null,
      phone: null,
    })

    const { gyms } = await sut.execute({
      userLatitude: -23.7372146,
      userLongitude: -46.5768568,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'JavaScript Gym' })])
  })
})
